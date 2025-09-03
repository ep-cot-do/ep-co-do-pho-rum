package com.fcoder.Fcoder.model.dto.request;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "Request for registering a member account with full details")
public class MemberAccountDetailRegisterRequest {
    @NotNull(message = "Role ID shouldn't be empty")
    private Long roleId;

    @NotBlank(message = "Username shouldn't be empty")
    private String username;

    @NotBlank(message = "Password shouldn't be empty")
    private String password;

    @NotBlank(message = "Re Password shouldn't be empty")
    private String rePassword;

    @Email(message = "Email isn't in valid format")
    @NotBlank(message = "Email shouldn't be empty")
    private String email;

    private String github;

    @NotBlank(message = "Student code shouldn't be empty")
    @Size(min = 8, max = 8, message = "Student code must be exactly 8 characters")
    private String studentCode;

    @NotBlank(message = "Full Name shouldn't be empty")
    private String fullName;

    @NotBlank(message = "Gender shouldn't be empty")
    @Pattern(regexp = "^(MALE|FEMALE|OTHER)$", message = "Gender must be MALE, FEMALE, or OTHER")
    private String gender;

    @NotBlank(message = "Phone number shouldn't be empty")
    @Pattern(regexp = "^(\\+84|0)[35789]\\d{8}$", message = "Invalid Vietnamese phone number")
    private String phone;

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

    private Boolean fundStatus = true;
    private Boolean isActive = true;
}