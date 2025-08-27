package com.fcoder.Fcoder.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "test_cases")
@Getter
@Setter
public class TestCaseEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    private ProblemEntity problem;

    @Column(name = "input", columnDefinition = "TEXT", nullable = false)
    private String input;

    @Column(name = "expected_output", columnDefinition = "TEXT", nullable = false)
    private String expectedOutput;

    @Column(name = "is_sample", nullable = false)
    private Boolean isSample = false;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "test_order")
    private Integer testOrder;

    @Column(name = "points")
    private Integer points = 1;
}
