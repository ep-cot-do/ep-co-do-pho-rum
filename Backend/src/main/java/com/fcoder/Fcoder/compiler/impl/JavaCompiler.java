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
 * Java compiler implementation using FCoder unified compiler container
 */
public class JavaCompiler extends BaseCompiler {

    private static final Logger log = LoggerFactory.getLogger(JavaCompiler.class);

    private static final String DOCKER_IMAGE = "fcoder-fcoder-compiler:latest";
    private static final int COMPILE_TIMEOUT = 30; // seconds

    public JavaCompiler() {
        super(DOCKER_IMAGE, SubmissionEntity.ProgrammingLanguage.JAVA);
    }

    @Override
    public CompilationResult compile(String sourceCode, Path workspace) {
        try {
            // Create source file
            Path sourceFile = workspace.resolve(getSourceFileName());
            Files.write(sourceFile, sourceCode.getBytes());

            // Get compile command and replace workspace placeholder
            String[] compileCommand = getCompileCommand();
            for (int i = 0; i < compileCommand.length; i++) {
                if (compileCommand[i].contains("%WORKSPACE%")) {
                    compileCommand[i] = compileCommand[i].replace(
                            "%WORKSPACE%",
                            workspace.toString().replace("\\", "/"));
                }
            }

            // Run compilation in Docker container
            ProcessBuilder pb = new ProcessBuilder(compileCommand);
            pb.directory(workspace.toFile());
            pb.redirectErrorStream(true);

            log.info("Compiling Java code in Docker container: {}", dockerImage);
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
            log.error("Error during Java compilation", e);
            return new CompilationResult(false, null, "Compilation error: " + e.getMessage());
        }
    }

    @Override
    public String getFileExtension() {
        return ".java";
    }

    @Override
    public String getSourceFileName() {
        return "Main.java";
    }

    @Override
    public String getExecutableFileName() {
        return "Main.class";
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
                "javac", getSourceFileName()
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
                "java", "Main"
        };
    }
}
