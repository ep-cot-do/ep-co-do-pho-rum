package com.fcoder.Fcoder.model.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ProfileRequest {
    @Email(message = "Email isn't in valid format")
    @NotBlank(message = "Email shouldn't be empty")
    private String email;

    @NotBlank(message = "Github shouldn't be empty")
    private String github;

    @NotBlank(message = "Student code shouldn't be empty")
    @Size(min = 8, max = 8, message = "Student code  must be exactly 8 characters")
    private String studentCode;

    @NotBlank(message = "Full Name shouldn't be empty")
    private String fullName;

    @NotBlank(message = "Gender shouldn't be empty")
    @Pattern(regexp = "^(MALE|FEMALE|OTHER)$", message = "Gender must be MALE, FEMALE, or OTHER")
    private String gender;

    @NotBlank(message = "Phone number shouldn't be empty")
    @Pattern(regexp = "^(\\+84|0)[35789]\\d{8}$", message = "Invalid Vietnamese phone number")
    private String phone;

    @NotBlank(message = "Major shouldn't be empty")
    @NotNull(message = "Major shouldn't be empty")
    @Size(max = 33, message = "Major cannot exceed 33 characters")
    private String major;

    @NotNull(message = "Birthday shouldn't be blank")
    @Past(message = "Birthday must be in the past")
    private LocalDate birthday;

    private String profileImg;

    @NotNull(message = "Current term shouldn't be empty")
    @Min(value = 1, message = "Current term must be at least 1")
    @Max(value = 9, message = "Current term cannot exceed 9")
    private Integer currentTerm;

}

