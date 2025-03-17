package com.fcoder.Fcoder.model.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FaqRequest {
    @NotNull(message = "Question is required")
    private String question;
    @NotNull(message = "Answer is required")
    private String answer;
    @NotNull(message = "Is active is required")
    private boolean isActive;
}