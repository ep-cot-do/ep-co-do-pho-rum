package com.fcoder.Fcoder.model.other;

import com.fcoder.Fcoder.model.entity.SubmissionEntity;
import lombok.Data;

import java.util.List;

@Data
public class ExecutionResult {
    private SubmissionEntity.SubmissionStatus status;
    private int passedTests;
    private int totalTests;
    private long executionTime;
    private long memoryUsed;
    private double score;
    private String errorMessage;
    private List<TestCaseResult> testResults;

    public ExecutionResult() {
    }

    public ExecutionResult(SubmissionEntity.SubmissionStatus status, String errorMessage) {
        this.status = status;
        this.errorMessage = errorMessage;
    }
}
