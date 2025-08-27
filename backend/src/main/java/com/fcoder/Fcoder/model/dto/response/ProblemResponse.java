package com.fcoder.Fcoder.model.dto.response;

import com.fcoder.Fcoder.model.entity.ProblemEntity;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProblemResponse {
    private Long id;
    private String title;
    private String description;
    private String inputFormat;
    private String outputFormat;
    private String constraints;
    private Integer timeLimit;
    private Integer memoryLimit;
    private ProblemEntity.ProblemDifficulty difficulty;
    private String category;
    private List<String> tags;
    private Boolean isActive;
    private String createdBy;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    private List<TestCaseResponse> sampleTestCases;
    private Integer totalSubmissions;
    private Integer acceptedSubmissions;
    private Double acceptanceRate;
}
