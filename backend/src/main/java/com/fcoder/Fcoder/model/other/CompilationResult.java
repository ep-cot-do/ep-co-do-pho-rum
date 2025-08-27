package com.fcoder.Fcoder.model.other;

import lombok.Data;

@Data
public class CompilationResult {
    private boolean success;
    private String executablePath;
    private String errorMessage;

    public CompilationResult(boolean success, String executablePath, String errorMessage) {
        this.success = success;
        this.executablePath = executablePath;
        this.errorMessage = errorMessage;
    }
}
