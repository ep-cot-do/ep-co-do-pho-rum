package com.fcoder.Fcoder.model.other;

import com.fcoder.Fcoder.model.entity.SubmissionEntity;
import lombok.Data;

@Data
public class TestCaseResult {
    private boolean passed;
    private String actualOutput;
    private String expectedOutput;
    private long executionTime;
    private long memoryUsed;
    private String errorMessage;
    private SubmissionEntity.SubmissionStatus status;

    public TestCaseResult() {
    }

    public TestCaseResult(boolean passed, String actualOutput, String expectedOutput) {
        this.passed = passed;
        this.actualOutput = actualOutput;
        this.expectedOutput = expectedOutput;
    }
}
