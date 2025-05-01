package com.fcoder.Fcoder.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AuthRequest {
    @NotBlank(message = "Username shouldn't be empty")
    private String username;
    @NotBlank(message = "Password shouldn't be empty")
    private String password;
}
