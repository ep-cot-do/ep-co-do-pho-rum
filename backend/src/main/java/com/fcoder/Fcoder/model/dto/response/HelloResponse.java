package com.fcoder.Fcoder.model.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Hello Response")
public class HelloResponse {
    @Schema(description = "Greeting message", example = "Hello, World!")
    private String message;
}