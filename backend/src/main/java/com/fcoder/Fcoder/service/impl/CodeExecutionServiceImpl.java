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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class CodeExecutionServiceImpl implements CodeExecutionService {

    private static final Logger log = LoggerFactory.getLogger(CodeExecutionServiceImpl.class);

    private static final String WORKSPACE_BASE = System.getProperty("java.io.tmpdir").replace("\\", "/") + "/code-execution/";

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
            log.info("Starting compilation for language: {}", language);
            log.debug("Source code length: {} characters", sourceCode.length());
            
            // Set timeout cho compilation
            long startTime = System.currentTimeMillis();
            long compilationTimeout = 30000; // 30 seconds

            // Get the appropriate compiler for the language
            BaseCompiler compiler = compilerFactory.getCompiler(language);

            // Check if compiler is available
            if (!compilerFactory.isCompilerAvailable(language)) {
                log.error("Compiler not available for language: {}", language);
                return new CompilationResult(false, null, "Compiler not available for language: " + language);
            }

            // Create temporary workspace
            Path workspace = createWorkspace();
            log.info("Created workspace: {}", workspace);

            // Use the compiler to compile the source code
            CompilationResult result = compiler.compile(sourceCode, workspace);
            log.info("Compilation result - Success: {}, Error: {}", result.isSuccess(), result.getErrorMessage());

            // Check compilation timeout
            long compilationTime = System.currentTimeMillis() - startTime;
            if (compilationTime > compilationTimeout) {
                log.warn("Compilation timeout for language {}: {}ms", language, compilationTime);
                return new CompilationResult(false, null, "Compilation timeout exceeded");
            }

            return result;

        } catch (Exception e) {
            log.error("Error during compilation for language {}: {}", language, e.getMessage(), e);
            return new CompilationResult(false, null, "Compilation error: " + e.getMessage());
        }
    }

    @Override
    public TestCaseResult runTestCase(String executablePath,
            TestCaseEntity testCase,
            int timeLimit,
            int memoryLimit) {
        try {
            log.info("Running test case for executable: {}", executablePath);
            
            // Get the compiler for execution
            Path executableFilePath = Paths.get(executablePath);
            Path workspace = executableFilePath.getParent();

            // Determine language from executable path and get execution command
            SubmissionEntity.ProgrammingLanguage language = determineLanguageFromPath(executablePath);
            log.info("Determined language: {} for path: {}", language, executablePath);
            
            BaseCompiler compiler = compilerFactory.getCompiler(language);
            String[] executionCommand = compiler.getExecutionCommand();

            // Update Docker volume mount to use the correct workspace
            for (int i = 0; i < executionCommand.length; i++) {
                if (executionCommand[i].contains("%WORKSPACE%")) {
                    executionCommand[i] = executionCommand[i].replace(
                            "%WORKSPACE%",
                            workspace.toString().replace("\\", "/"));
                }
            }

            log.info("Execution command: {}", String.join(" ", executionCommand));
            log.info("Workspace: {}", workspace);
            log.info("Test case input: {}", testCase.getInput());
            
            ProcessBuilder pb = new ProcessBuilder(executionCommand);
            pb.directory(workspace.toFile());
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

            log.info("Test case execution completed:");
            log.info("  Expected output: '{}'", expectedOutput);
            log.info("  Actual output: '{}'", actualOutput);
            log.info("  Execution time: {}ms", executionTime);
            log.info("  Process exit code: {}", process.exitValue());

            // Compare outputs
            boolean passed = expectedOutput.equals(actualOutput);

            TestCaseResult result = new TestCaseResult();
            result.setPassed(passed);
            result.setActualOutput(actualOutput);
            result.setExpectedOutput(expectedOutput);
            result.setExecutionTime(executionTime);
            result.setMemoryUsed(0); // Memory measurement would require native tools

            log.info("Test case result: {}", passed ? "PASSED" : "FAILED");
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
    @Override
    public java.util.Map<SubmissionEntity.ProgrammingLanguage, String> getCompilerInfo() {
        return compilerFactory.getCompilerInfo();
    }

    /**
     * Check if compiler is available for a specific language
     */
    @Override
    public boolean isCompilerAvailable(SubmissionEntity.ProgrammingLanguage language) {
        return compilerFactory.isCompilerAvailable(language);
    }

    /**
     * Get all supported programming languages
     */
    @Override
    public SubmissionEntity.ProgrammingLanguage[] getSupportedLanguages() {
        return compilerFactory.getSupportedLanguages();
    }

    /**
     * Check system requirements for all compilers
     */
    @Override
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

    /**
     * Determine programming language from executable path
     */
    private SubmissionEntity.ProgrammingLanguage determineLanguageFromPath(String executablePath) {
        if (executablePath.endsWith(".class") || executablePath.contains("Main.class")) {
            return SubmissionEntity.ProgrammingLanguage.JAVA;
        } else if (executablePath.endsWith(".py") || executablePath.contains("main.py")) {
            return SubmissionEntity.ProgrammingLanguage.PYTHON;
        } else if (executablePath.endsWith(".js") || executablePath.contains("main.js")) {
            return SubmissionEntity.ProgrammingLanguage.JAVASCRIPT;
        } else if (executablePath.contains("main.cpp")
                || (!executablePath.contains(".") && executablePath.contains("cpp"))) {
            return SubmissionEntity.ProgrammingLanguage.CPP;
        } else {
            return SubmissionEntity.ProgrammingLanguage.C; // Default to C for compiled executables
        }
    }
}
