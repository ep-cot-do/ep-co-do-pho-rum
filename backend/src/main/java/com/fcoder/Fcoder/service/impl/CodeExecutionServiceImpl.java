package com.fcoder.Fcoder.service.impl;

import com.fcoder.Fcoder.model.entity.SubmissionEntity;
import com.fcoder.Fcoder.model.entity.TestCaseEntity;
import com.fcoder.Fcoder.model.other.CompilationResult;
import com.fcoder.Fcoder.model.other.ExecutionResult;
import com.fcoder.Fcoder.model.other.TestCaseResult;
import com.fcoder.Fcoder.service.CodeExecutionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class CodeExecutionServiceImpl implements CodeExecutionService {

    private static final String WORKSPACE_BASE = System.getProperty("java.io.tmpdir") + "/code-execution/";

    @Override
    public ExecutionResult executeCode(String sourceCode,
            SubmissionEntity.ProgrammingLanguage language,
            List<TestCaseEntity> testCases,
            int timeLimit,
            int memoryLimit) {

        ExecutionResult result = new ExecutionResult();

        try {
            // Compile code
            CompilationResult compilationResult = compileCode(sourceCode, language);
            if (!compilationResult.isSuccess()) {
                result.setStatus(SubmissionEntity.SubmissionStatus.COMPILE_ERROR);
                result.setErrorMessage(compilationResult.getErrorMessage());
                return result;
            }

            // Execute test cases
            int passedTests = 0;
            long totalExecutionTime = 0;
            long maxMemoryUsed = 0;

            for (TestCaseEntity testCase : testCases) {
                TestCaseResult testResult = runTestCase(
                        compilationResult.getExecutablePath(),
                        testCase,
                        timeLimit,
                        memoryLimit);

                totalExecutionTime += testResult.getExecutionTime();
                maxMemoryUsed = Math.max(maxMemoryUsed, testResult.getMemoryUsed());

                if (testResult.isPassed()) {
                    passedTests++;
                }
            }

            // Set result
            result.setPassedTests(passedTests);
            result.setTotalTests(testCases.size());
            result.setExecutionTime(totalExecutionTime);
            result.setMemoryUsed(maxMemoryUsed);
            result.setScore((double) passedTests / testCases.size() * 100);

            // Determine status
            if (passedTests == testCases.size()) {
                result.setStatus(SubmissionEntity.SubmissionStatus.ACCEPTED);
            } else {
                result.setStatus(SubmissionEntity.SubmissionStatus.WRONG_ANSWER);
            }

        } catch (Exception e) {
            log.error("Error executing code", e);
            result.setStatus(SubmissionEntity.SubmissionStatus.RUNTIME_ERROR);
            result.setErrorMessage("System error: " + e.getMessage());
        }

        return result;
    }

    @Override
    public CompilationResult compileCode(String sourceCode,
            SubmissionEntity.ProgrammingLanguage language) {
        try {
            // Create temporary workspace
            Path workspace = createWorkspace();

            String fileName = getFileName(language);
            Path sourceFile = workspace.resolve(fileName);

            // Write source code to file
            Files.write(sourceFile, sourceCode.getBytes());

            // Compile based on language
            return switch (language) {
                case JAVA -> compileJava(sourceFile, workspace);
                case CPP -> compileCpp(sourceFile, workspace);
                case C -> compileC(sourceFile, workspace);
                case PYTHON -> new CompilationResult(true, "python", null); // Python doesn't need compilation
                case GO -> compileGo(sourceFile, workspace);
                case JAVASCRIPT -> new CompilationResult(true, "node", null); // JavaScript doesn't need compilation
                case CSHARP -> compileCSharp(sourceFile, workspace);
                default -> new CompilationResult(false, null, "Unsupported language: " + language);
            };
        } catch (Exception e) {
            return new CompilationResult(false, null, "Compilation error: " + e.getMessage());
        }
    }

    @Override
    public TestCaseResult runTestCase(String executablePath,
            TestCaseEntity testCase,
            int timeLimit,
            int memoryLimit) {
        try {
            ProcessBuilder pb = new ProcessBuilder(executablePath);
            pb.redirectErrorStream(true);

            long startTime = System.currentTimeMillis();
            Process process = pb.start();

            // Provide input
            if (testCase.getInput() != null && !testCase.getInput().isEmpty()) {
                try (OutputStreamWriter writer = new OutputStreamWriter(process.getOutputStream())) {
                    writer.write(testCase.getInput());
                    writer.flush();
                }
            }

            // Wait for completion with timeout
            boolean finished = process.waitFor(timeLimit, TimeUnit.MILLISECONDS);
            long endTime = System.currentTimeMillis();
            long executionTime = endTime - startTime;

            if (!finished) {
                process.destroyForcibly();
                TestCaseResult result = new TestCaseResult();
                result.setPassed(false);
                result.setErrorMessage("Time limit exceeded");
                result.setExecutionTime(timeLimit);
                return result;
            }

            // Get output
            String actualOutput = readProcessOutput(process);
            String expectedOutput = testCase.getExpectedOutput().trim();
            actualOutput = actualOutput.trim();

            // Compare outputs
            boolean passed = expectedOutput.equals(actualOutput);

            TestCaseResult result = new TestCaseResult();
            result.setPassed(passed);
            result.setActualOutput(actualOutput);
            result.setExpectedOutput(expectedOutput);
            result.setExecutionTime(executionTime);
            result.setMemoryUsed(0); // Memory measurement would require native tools

            return result;

        } catch (Exception e) {
            TestCaseResult result = new TestCaseResult();
            result.setPassed(false);
            result.setErrorMessage("Runtime error: " + e.getMessage());
            return result;
        }
    }

    @Override
    public void cleanup(String workspacePath) {
        try {
            Path workspace = Paths.get(workspacePath);
            Files.walk(workspace)
                    .sorted((a, b) -> b.compareTo(a)) // Delete files before directories
                    .forEach(path -> {
                        try {
                            Files.delete(path);
                        } catch (IOException e) {
                            log.warn("Failed to delete: " + path, e);
                        }
                    });
        } catch (IOException e) {
            log.warn("Failed to cleanup workspace: " + workspacePath, e);
        }
    }

    private Path createWorkspace() throws IOException {
        Path workspace = Paths.get(WORKSPACE_BASE + System.currentTimeMillis());
        Files.createDirectories(workspace);
        return workspace;
    }

    private String getFileName(SubmissionEntity.ProgrammingLanguage language) {
        return switch (language) {
            case JAVA -> "Solution.java";
            case CPP -> "solution.cpp";
            case C -> "solution.c";
            case PYTHON -> "solution.py";
            case GO -> "solution.go";
            case JAVASCRIPT -> "solution.js";
            case CSHARP -> "Solution.cs";
            default -> "solution.txt";
        };
    }

    private CompilationResult compileJava(Path sourceFile, Path workspace) {
        try {
            ProcessBuilder pb = new ProcessBuilder("javac", sourceFile.getFileName().toString());
            pb.directory(workspace.toFile());
            Process process = pb.start();

            boolean finished = process.waitFor(30, TimeUnit.SECONDS);
            if (!finished) {
                process.destroyForcibly();
                return new CompilationResult(false, null, "Compilation timeout");
            }

            if (process.exitValue() != 0) {
                String error = readProcessOutput(process);
                return new CompilationResult(false, null, error);
            }

            return new CompilationResult(true, "java", null);
        } catch (Exception e) {
            return new CompilationResult(false, null, "Compilation error: " + e.getMessage());
        }
    }

    private CompilationResult compileCpp(Path sourceFile, Path workspace) {
        try {
            String executablePath = workspace.resolve("solution").toString();
            ProcessBuilder pb = new ProcessBuilder("g++", "-o", "solution", sourceFile.getFileName().toString());
            pb.directory(workspace.toFile());
            Process process = pb.start();

            boolean finished = process.waitFor(30, TimeUnit.SECONDS);
            if (!finished) {
                process.destroyForcibly();
                return new CompilationResult(false, null, "Compilation timeout");
            }

            if (process.exitValue() != 0) {
                String error = readProcessOutput(process);
                return new CompilationResult(false, null, error);
            }

            return new CompilationResult(true, executablePath, null);
        } catch (Exception e) {
            return new CompilationResult(false, null, "Compilation error: " + e.getMessage());
        }
    }

    private CompilationResult compileC(Path sourceFile, Path workspace) {
        try {
            String executablePath = workspace.resolve("solution").toString();
            ProcessBuilder pb = new ProcessBuilder("gcc", "-o", "solution", sourceFile.getFileName().toString());
            pb.directory(workspace.toFile());
            Process process = pb.start();

            boolean finished = process.waitFor(30, TimeUnit.SECONDS);
            if (!finished) {
                process.destroyForcibly();
                return new CompilationResult(false, null, "Compilation timeout");
            }

            if (process.exitValue() != 0) {
                String error = readProcessOutput(process);
                return new CompilationResult(false, null, error);
            }

            return new CompilationResult(true, executablePath, null);
        } catch (Exception e) {
            return new CompilationResult(false, null, "Compilation error: " + e.getMessage());
        }
    }

    private CompilationResult compileGo(Path sourceFile, Path workspace) {
        try {
            String executablePath = workspace.resolve("solution").toString();
            ProcessBuilder pb = new ProcessBuilder("go", "build", "-o", "solution",
                    sourceFile.getFileName().toString());
            pb.directory(workspace.toFile());
            Process process = pb.start();

            boolean finished = process.waitFor(30, TimeUnit.SECONDS);
            if (!finished) {
                process.destroyForcibly();
                return new CompilationResult(false, null, "Compilation timeout");
            }

            if (process.exitValue() != 0) {
                String error = readProcessOutput(process);
                return new CompilationResult(false, null, error);
            }

            return new CompilationResult(true, executablePath, null);
        } catch (Exception e) {
            return new CompilationResult(false, null, "Compilation error: " + e.getMessage());
        }
    }

    private CompilationResult compileCSharp(Path sourceFile, Path workspace) {
        try {
            String executablePath = workspace.resolve("solution.exe").toString();
            ProcessBuilder pb = new ProcessBuilder("csc", "/out:solution.exe", sourceFile.getFileName().toString());
            pb.directory(workspace.toFile());
            Process process = pb.start();

            boolean finished = process.waitFor(30, TimeUnit.SECONDS);
            if (!finished) {
                process.destroyForcibly();
                return new CompilationResult(false, null, "Compilation timeout");
            }

            if (process.exitValue() != 0) {
                String error = readProcessOutput(process);
                return new CompilationResult(false, null, error);
            }

            return new CompilationResult(true, executablePath, null);
        } catch (Exception e) {
            return new CompilationResult(false, null, "Compilation error: " + e.getMessage());
        }
    }

    private String readProcessOutput(Process process) throws IOException {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
            return output.toString();
        }
    }
}
