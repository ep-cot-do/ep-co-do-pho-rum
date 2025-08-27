package com.fcoder.Fcoder.compiler.impl;

import com.fcoder.Fcoder.compiler.BaseCompiler;
import com.fcoder.Fcoder.model.entity.SubmissionEntity;
import com.fcoder.Fcoder.model.other.CompilationResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.TimeUnit;

/**
 * C++ compiler implementation using FCoder unified compiler container
 */
public class CppCompiler extends BaseCompiler {

    private static final Logger log = LoggerFactory.getLogger(CppCompiler.class);
    private static final String DOCKER_IMAGE = "fcoder-fcoder-compiler:latest";
    private static final int COMPILE_TIMEOUT = 30; // seconds

    public CppCompiler() {
        super(DOCKER_IMAGE, SubmissionEntity.ProgrammingLanguage.CPP);
    }

    @Override
    public CompilationResult compile(String sourceCode, Path workspace) {
        try {
            // Create source file
            Path sourceFile = workspace.resolve(getSourceFileName());
            Files.write(sourceFile, sourceCode.getBytes());

            // Get compile command and replace workspace placeholder
            String[] compileCommand = getCompileCommand();
            String normalizedWorkspace = workspace.toString().replace("\\", "/");
            log.info("Normalized workspace path: {}", normalizedWorkspace);
            
            for (int i = 0; i < compileCommand.length; i++) {
                if (compileCommand[i].contains("%WORKSPACE%")) {
                    compileCommand[i] = compileCommand[i].replace("%WORKSPACE%", normalizedWorkspace);
                }
            }
            
            log.info("Docker compile command: {}", String.join(" ", compileCommand));

            // Run compilation in Docker container
            ProcessBuilder pb = new ProcessBuilder(compileCommand);
            pb.directory(workspace.toFile());
            pb.redirectErrorStream(true);

            log.info("Compiling C++ code in FCoder unified compiler container: {}", dockerImage);
            Process process = pb.start();

            // Read compilation output
            StringBuilder output = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
            }

            // Wait for compilation to complete
            log.info("Waiting for compilation to complete (timeout: {}s)", COMPILE_TIMEOUT);
            boolean finished = process.waitFor(COMPILE_TIMEOUT, TimeUnit.SECONDS);

            if (!finished) {
                log.error("Compilation timeout after {}s", COMPILE_TIMEOUT);
                process.destroyForcibly();
                return new CompilationResult(false, null, "Compilation timeout");
            }
            
            log.info("Compilation process finished with exit code: {}", process.exitValue());

            if (process.exitValue() == 0) {
                // Compilation successful
                Path executablePath = workspace.resolve(getExecutableFileName());
                return new CompilationResult(true, executablePath.toString(), null);
            } else {
                // Compilation failed
                return new CompilationResult(false, null, output.toString());
            }

        } catch (IOException | InterruptedException e) {
            log.error("Error during C++ compilation", e);
            return new CompilationResult(false, null, "Compilation error: " + e.getMessage());
        }
    }

    @Override
    public String getFileExtension() {
        return ".cpp";
    }

    @Override
    public String getSourceFileName() {
        return "main.cpp";
    }

    @Override
    public String getExecutableFileName() {
        return "main";
    }

    @Override
    protected String[] getCompileCommand() {
        return new String[] {
                "docker", "run", "--rm",
                "-v", "%WORKSPACE%:/workspace",
                "-w", "/workspace",
                "--memory=512m",
                "--cpus=1",
                "--network=none",
                dockerImage,
                "g++", "-o", getExecutableFileName(), getSourceFileName(),
                "-std=c++17", "-O2", "-Wall"
        };
    }

    @Override
    public String[] getExecutionCommand() {
        return new String[] {
                "docker", "run", "--rm",
                "-v", "%WORKSPACE%:/workspace",
                "-w", "/workspace",
                "--memory=512m",
                "--cpus=1",
                "--network=none",
                "-i", // Interactive mode for input
                dockerImage,
                "./" + getExecutableFileName()
        };
    }
}
