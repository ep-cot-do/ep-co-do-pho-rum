package com.fcoder.Fcoder.model.dto.request;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ResetPasswordRequest {
    private String email;
    private String newPassword;
}