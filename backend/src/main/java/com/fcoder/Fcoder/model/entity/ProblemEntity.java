package com.fcoder.Fcoder.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "problems")
@Getter
@Setter
public class ProblemEntity extends BaseEntity {

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "input_format", columnDefinition = "TEXT")
    private String inputFormat;

    @Column(name = "output_format", columnDefinition = "TEXT")
    private String outputFormat;

    @Column(name = "constraints", columnDefinition = "TEXT")
    private String constraints;

    @Column(name = "time_limit", nullable = false)
    private Integer timeLimit; // in milliseconds

    @Column(name = "memory_limit", nullable = false)
    private Integer memoryLimit; // in MB

    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty")
    private ProblemDifficulty difficulty;

    @Column(name = "category")
    private String category;

    @Column(name = "tags")
    private String tags; // JSON string for multiple tags

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private AccountEntity createdBy;

    @OneToMany(mappedBy = "problem", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TestCaseEntity> testCases;

    @OneToMany(mappedBy = "problem", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<SubmissionEntity> submissions;

    public enum ProblemDifficulty {
        EASY, MEDIUM, HARD
    }
}
