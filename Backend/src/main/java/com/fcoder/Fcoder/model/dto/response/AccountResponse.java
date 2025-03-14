package com.fcoder.Fcoder.model.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AccountResponse {
    private Long id;
    private String username;
    private String email;
}