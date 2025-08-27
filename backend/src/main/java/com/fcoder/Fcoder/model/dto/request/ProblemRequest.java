package com.fcoder.Fcoder.model.dto.request;

import com.fcoder.Fcoder.model.entity.ProblemEntity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.util.List;

@Data
public class ProblemRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private String inputFormat;

    private String outputFormat;

    private String constraints;

    @NotNull(message = "Time limit is required")
    @Positive(message = "Time limit must be positive")
    private Integer timeLimit;

    @NotNull(message = "Memory limit is required")
    @Positive(message = "Memory limit must be positive")
    private Integer memoryLimit;

    private ProblemEntity.ProblemDifficulty difficulty;

    private String category;

    private List<String> tags;

    private Boolean isActive = true;

    private List<TestCaseRequest> testCases;
}
