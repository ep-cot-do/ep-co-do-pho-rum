package com.fcoder.Fcoder.model.dto.request;

import lombok.Data;

@Data
public class AccountRegisterRequest {
    private String username;
    private String email;
    private String password;
    private String rePassword;
    private String studentCode;
    private String major;
    private boolean fundStatus;
    private boolean isActive;
    private Integer currentTerm;
}