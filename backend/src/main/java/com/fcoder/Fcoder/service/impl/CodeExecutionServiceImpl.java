package com.fcoder.Fcoder.service.impl;

import com.fcoder.Fcoder.compiler.CompilerFactory;
import com.fcoder.Fcoder.compiler.BaseCompiler;
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
    
    private final CompilerFactory compilerFactory;

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
            // Get the appropriate compiler for the language
            BaseCompiler compiler = compilerFactory.getCompiler(language);
            
            // Check if compiler is available
            if (!compilerFactory.isCompilerAvailable(language)) {
                return new CompilationResult(false, null, "Compiler not available for language: " + language);
            }

            // Create temporary workspace
            Path workspace = createWorkspace();

            // Use the compiler to compile the source code
            return compiler.compile(sourceCode, workspace);
            
        } catch (Exception e) {
            log.error("Error during compilation for language {}: {}", language, e.getMessage());
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

    /**
     * Get compiler information for all supported languages
     */
    public java.util.Map<SubmissionEntity.ProgrammingLanguage, String> getCompilerInfo() {
        return compilerFactory.getCompilerInfo();
    }

    /**
     * Check if compiler is available for a specific language
     */
    public boolean isCompilerAvailable(SubmissionEntity.ProgrammingLanguage language) {
        return compilerFactory.isCompilerAvailable(language);
    }

    /**
     * Get all supported programming languages
     */
    public SubmissionEntity.ProgrammingLanguage[] getSupportedLanguages() {
        return compilerFactory.getSupportedLanguages();
    }

    /**
     * Check system requirements for all compilers
     */
    public java.util.Map<SubmissionEntity.ProgrammingLanguage, Boolean> checkSystemRequirements() {
        return compilerFactory.checkSystemRequirements();
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
