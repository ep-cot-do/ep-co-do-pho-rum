package com.fcoder.Fcoder.compiler;

import com.fcoder.Fcoder.model.entity.SubmissionEntity;
import com.fcoder.Fcoder.model.other.CompilationResult;

import java.nio.file.Path;

/**
 * Base abstract class for all compilers in the system.
 * Each compiler runs in a Docker container for security and isolation.
 */
public abstract class BaseCompiler {

    protected final String dockerImage;
    protected final SubmissionEntity.ProgrammingLanguage language;

    public BaseCompiler(String dockerImage, SubmissionEntity.ProgrammingLanguage language) {
        this.dockerImage = dockerImage;
        this.language = language;
    }

    /**
     * Compile source code using Docker container
     * 
     * @param sourceCode The source code to compile
     * @param workspace  The workspace directory for compilation
     * @return CompilationResult with success status and executable path or error
     *         message
     */
    public abstract CompilationResult compile(String sourceCode, Path workspace);

    /**
     * Get the file extension for this language
     * 
     * @return File extension (e.g., ".java", ".cpp", ".py")
     */
    public abstract String getFileExtension();

    /**
     * Get the source file name for this language
     * 
     * @return Source file name (e.g., "Main.java", "main.cpp", "main.py")
     */
    public abstract String getSourceFileName();

    /**
     * Get the executable file name after compilation
     * 
     * @return Executable file name (e.g., "Main", "main.exe", "main.py")
     */
    public abstract String getExecutableFileName();

    /**
     * Get the compile command to run inside Docker container
     * 
     * @return Compile command array
     */
    protected abstract String[] getCompileCommand();

    /**
     * Get the execution command to run the compiled program
     * 
     * @return Execution command array
     */
    public abstract String[] getExecutionCommand();

    /**
     * Check if the compiler is available (Docker image exists)
     * 
     * @return true if compiler is available
     */
    public boolean isAvailable() {
        try {
            ProcessBuilder pb = new ProcessBuilder("docker", "image", "inspect", dockerImage);
            Process process = pb.start();
            return process.waitFor() == 0;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Get compiler information
     * 
     * @return Compiler info string
     */
    public String getCompilerInfo() {
        return String.format("%s (Docker: %s)", language.name(), dockerImage);
    }

    public SubmissionEntity.ProgrammingLanguage getLanguage() {
        return language;
    }

    public String getDockerImage() {
        return dockerImage;
    }
}
