package com.fcoder.Fcoder.model.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MemberAccountRegisterResponse {
    private Long id;
    private String username;
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
    private Boolean fundStatus;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    private Boolean isActive;
    private String role;
}
