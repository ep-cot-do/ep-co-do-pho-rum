package com.fcoder.Fcoder.model.dto.request;

import com.fcoder.Fcoder.model.entity.SubmissionEntity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SubmissionRequest {

    @NotNull(message = "Problem ID is required")
    private Long problemId;

    @NotBlank(message = "Source code is required")
    private String sourceCode;

    @NotNull(message = "Programming language is required")
    private SubmissionEntity.ProgrammingLanguage language;
}
