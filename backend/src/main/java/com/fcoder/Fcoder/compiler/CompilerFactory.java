package com.fcoder.Fcoder.compiler;

import com.fcoder.Fcoder.compiler.impl.*;
import com.fcoder.Fcoder.model.entity.SubmissionEntity;
import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.Map;

/**
 * Factory class for managing different compilers that run in Docker containers.
 * This factory provides compilers for various programming languages.
 */
@Component
public class CompilerFactory {

    private final Map<SubmissionEntity.ProgrammingLanguage, BaseCompiler> compilers;

    public CompilerFactory() {
        compilers = new EnumMap<>(SubmissionEntity.ProgrammingLanguage.class);
        initializeCompilers();
    }

    /**
     * Initialize all available compilers
     */
    private void initializeCompilers() {
        // Java compiler using OpenJDK Docker image
        compilers.put(SubmissionEntity.ProgrammingLanguage.JAVA,
                new JavaCompiler());

        // C++ compiler using GCC Docker image
        compilers.put(SubmissionEntity.ProgrammingLanguage.CPP,
                new CppCompiler());

        // Python interpreter using Python Docker image
        compilers.put(SubmissionEntity.ProgrammingLanguage.PYTHON,
                new PythonCompiler());

        // C compiler using GCC Docker image
        compilers.put(SubmissionEntity.ProgrammingLanguage.C,
                new CCompiler());

        // JavaScript using Node.js Docker image
        compilers.put(SubmissionEntity.ProgrammingLanguage.JAVASCRIPT,
                new JavaScriptCompiler());
    }

    /**
     * Get compiler for specified language
     * 
     * @param language Programming language
     * @return BaseCompiler instance
     * @throws IllegalArgumentException if language is not supported
     */
    public BaseCompiler getCompiler(SubmissionEntity.ProgrammingLanguage language) {
        BaseCompiler compiler = compilers.get(language);
        if (compiler == null) {
            throw new IllegalArgumentException("Unsupported programming language: " + language);
        }
        return compiler;
    }

    /**
     * Check if compiler is available for the specified language
     * 
     * @param language Programming language
     * @return true if compiler is available and Docker image exists
     */
    public boolean isCompilerAvailable(SubmissionEntity.ProgrammingLanguage language) {
        BaseCompiler compiler = compilers.get(language);
        return compiler != null && compiler.isAvailable();
    }

    /**
     * Get information about all compilers
     * 
     * @return Map of language to compiler info
     */
    public Map<SubmissionEntity.ProgrammingLanguage, String> getCompilerInfo() {
        Map<SubmissionEntity.ProgrammingLanguage, String> info = new EnumMap<>(
                SubmissionEntity.ProgrammingLanguage.class);
        for (Map.Entry<SubmissionEntity.ProgrammingLanguage, BaseCompiler> entry : compilers.entrySet()) {
            info.put(entry.getKey(), entry.getValue().getCompilerInfo());
        }
        return info;
    }

    /**
     * Get all supported programming languages
     * 
     * @return Array of supported languages
     */
    public SubmissionEntity.ProgrammingLanguage[] getSupportedLanguages() {
        return compilers.keySet().toArray(new SubmissionEntity.ProgrammingLanguage[0]);
    }

    /**
     * Check system requirements for all compilers
     * 
     * @return Map of language to availability status
     */
    public Map<SubmissionEntity.ProgrammingLanguage, Boolean> checkSystemRequirements() {
        Map<SubmissionEntity.ProgrammingLanguage, Boolean> status = new EnumMap<>(
                SubmissionEntity.ProgrammingLanguage.class);
        for (Map.Entry<SubmissionEntity.ProgrammingLanguage, BaseCompiler> entry : compilers.entrySet()) {
            status.put(entry.getKey(), entry.getValue().isAvailable());
        }
        return status;
    }

    /**
     * Check if Docker is available on the system
     * 
     * @return true if Docker is available
     */
    public boolean isDockerAvailable() {
        try {
            ProcessBuilder pb = new ProcessBuilder("docker", "--version");
            Process process = pb.start();
            return process.waitFor() == 0;
        } catch (Exception e) {
            return false;
        }
    }
}
