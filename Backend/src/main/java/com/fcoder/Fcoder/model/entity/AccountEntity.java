package com.fcoder.Fcoder.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "account")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountEntity extends BaseEntity {

    @OneToOne(targetEntity = RoleEntity.class, fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "role_id", nullable = false)
    private RoleEntity role;

    @Column(name = "username", nullable = false, unique = true, length = 255)
    private String username;

    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "github", length = 255)
    private String github;

    @Column(name = "student_code",nullable = false, length = 8)
    private String studentCode;

    @Column(name = "full_name", length = 255)
    private String fullName;

    @Column(name = "gender", length = 6)
    private String gender;

    @Column(name = "phone", length = 15)
    private String phone;

    @Column(name = "major",nullable = false, length = 33)
    private String major;

    @Column(name = "birthday")
    private LocalDate birthday;

    @Column(name = "profile_img", length = 255)
    private String profileImg;

    @Column(name = "current_term",nullable = false, length = 9)
    private Integer currentTerm;

    @Column(name = "fund_status", nullable = false)
    private Boolean fundStatus;

    @Column(name = "last_login", nullable = false)
    private LocalDateTime lastLogin;

    @Column(name = "is_active",nullable = false)
    private Boolean isActive;
}
