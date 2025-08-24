package com.fcoder.Fcoder.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TestCaseRequest {

    @NotBlank(message = "Input is required")
    private String input;

    @NotBlank(message = "Expected output is required")
    private String expectedOutput;

    @NotNull(message = "isSample field is required")
    private Boolean isSample = false;

    private Boolean isActive = true;

    private Integer testOrder;

    private Integer points = 1;
}
