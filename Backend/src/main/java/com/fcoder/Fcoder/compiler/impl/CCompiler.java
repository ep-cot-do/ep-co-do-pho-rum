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
 * C compiler implementation using FCoder unified compiler container
 */
public class CCompiler extends BaseCompiler {

    private static final Logger log = LoggerFactory.getLogger(CCompiler.class);
    private static final String DOCKER_IMAGE = "fcoder-fcoder-compiler:latest";
    private static final int COMPILE_TIMEOUT = 30; // seconds

    public CCompiler() {
        super(DOCKER_IMAGE, SubmissionEntity.ProgrammingLanguage.C);
    }

    @Override
    public CompilationResult compile(String sourceCode, Path workspace) {
        try {
            // Create source file
            Path sourceFile = workspace.resolve(getSourceFileName());
            Files.write(sourceFile, sourceCode.getBytes());

            // Run compilation in Docker container
            ProcessBuilder pb = new ProcessBuilder(getCompileCommand());
            pb.directory(workspace.toFile());
            pb.redirectErrorStream(true);

            log.info("Compiling C code in Docker container: {}", dockerImage);
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
            boolean finished = process.waitFor(COMPILE_TIMEOUT, TimeUnit.SECONDS);

            if (!finished) {
                process.destroyForcibly();
                return new CompilationResult(false, null, "Compilation timeout");
            }

            if (process.exitValue() == 0) {
                // Compilation successful
                Path executablePath = workspace.resolve(getExecutableFileName());
                return new CompilationResult(true, executablePath.toString(), null);
            } else {
                // Compilation failed
                return new CompilationResult(false, null, output.toString());
            }

        } catch (IOException | InterruptedException e) {
            log.error("Error during C compilation", e);
            return new CompilationResult(false, null, "Compilation error: " + e.getMessage());
        }
    }

    @Override
    public String getFileExtension() {
        return ".c";
    }

    @Override
    public String getSourceFileName() {
        return "main.c";
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
                "gcc", "-o", getExecutableFileName(), getSourceFileName(),
                "-std=c11", "-O2", "-Wall"
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
