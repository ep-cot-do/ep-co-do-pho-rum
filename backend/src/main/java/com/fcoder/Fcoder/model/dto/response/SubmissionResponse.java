package com.fcoder.Fcoder.model.dto.response;

import com.fcoder.Fcoder.model.entity.SubmissionEntity;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class SubmissionResponse {
    private Long id;
    private Long problemId;
    private String problemTitle;
    private String username;
    private SubmissionEntity.ProgrammingLanguage language;
    private SubmissionEntity.SubmissionStatus status;
    private Integer executionTime;
    private Integer memoryUsed;
    private Integer passedTests;
    private Integer totalTests;
    private Double score;
    private String compileError;
    private String runtimeError;
    private String judgeMessage;
    private LocalDateTime submittedAt;
}
