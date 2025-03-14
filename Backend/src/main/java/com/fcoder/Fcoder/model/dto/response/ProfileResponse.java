package com.fcoder.Fcoder.model.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class ProfileResponse {
    private Long id;
    private String role;
    private String email;
    private String github;
    private String studentCode;
    private String fullName;
    private String gender;
    private String phone;
    private String major;
    private LocalDate birthday;
    private String profileImg;
    private Integer currentTerm;
    private boolean fundStatus;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    private boolean isActive;
}

