package com.fcoder.Fcoder.compiler.impl;

import com.fcoder.Fcoder.compiler.BaseCompiler;
import com.fcoder.Fcoder.model.entity.SubmissionEntity;
import com.fcoder.Fcoder.model.other.CompilationResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

/**
 * Python interpreter implementation using FCoder unified compiler container
 */
public class PythonCompiler extends BaseCompiler {

    private static final Logger log = LoggerFactory.getLogger(PythonCompiler.class);
    private static final String DOCKER_IMAGE = "fcoder-fcoder-compiler:latest";

    public PythonCompiler() {
        super(DOCKER_IMAGE, SubmissionEntity.ProgrammingLanguage.PYTHON);
    }

    @Override
    public CompilationResult compile(String sourceCode, Path workspace) {
        try {
            // Create source file
            Path sourceFile = workspace.resolve(getSourceFileName());
            Files.write(sourceFile, sourceCode.getBytes());

            // Python doesn't need compilation, just syntax check
            ProcessBuilder pb = new ProcessBuilder(
                    "docker", "run", "--rm",
                    "-v", workspace.toString().replace("\\", "/") + ":/workspace",
                    "-w", "/workspace",
                    "--memory=512m",
                    "--cpus=1",
                    "--network=none",
                    dockerImage,
                    "python", "-m", "py_compile", getSourceFileName());

            Process process = pb.start();
            boolean finished = process.waitFor(10, java.util.concurrent.TimeUnit.SECONDS);

            if (!finished) {
                process.destroyForcibly();
                return new CompilationResult(false, null, "Syntax check timeout");
            }

            if (process.exitValue() == 0) {
                // Syntax check successful
                return new CompilationResult(true, sourceFile.toString(), null);
            } else {
                // Syntax error
                return new CompilationResult(false, null, "Python syntax error");
            }

        } catch (IOException | InterruptedException e) {
            log.error("Error during Python syntax check", e);
            return new CompilationResult(false, null, "Syntax check error: " + e.getMessage());
        }
    }

    @Override
    public String getFileExtension() {
        return ".py";
    }

    @Override
    public String getSourceFileName() {
        return "main.py";
    }

    @Override
    public String getExecutableFileName() {
        return "main.py";
    }

    @Override
    protected String[] getCompileCommand() {
        // Python doesn't need compilation
        return new String[] {
                "docker", "run", "--rm",
                "-v", "%WORKSPACE%:/workspace",
                "-w", "/workspace",
                "--memory=512m",
                "--cpus=1",
                "--network=none",
                dockerImage,
                "python", "-m", "py_compile", getSourceFileName()
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
                "python", getSourceFileName()
        };
    }
}
