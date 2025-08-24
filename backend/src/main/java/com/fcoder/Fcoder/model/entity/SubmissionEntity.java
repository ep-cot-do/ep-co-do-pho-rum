package com.fcoder.Fcoder.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "submissions")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    private ProblemEntity problem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AccountEntity user;

    @Column(name = "source_code", columnDefinition = "TEXT", nullable = false)
    private String sourceCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "language", nullable = false)
    private ProgrammingLanguage language;

    @Column(name = "submission_time")
    private LocalDateTime submissionTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private SubmissionStatus status;

    @Column(name = "execution_time")
    private Integer executionTime; // in milliseconds

    @Column(name = "memory_used")
    private Integer memoryUsed; // in KB

    @Column(name = "passed_tests")
    @Builder.Default
    private Integer passedTests = 0;

    @Column(name = "total_tests")
    @Builder.Default
    private Integer totalTests = 0;

    @Column(name = "score")
    @Builder.Default
    private Double score = 0.0;

    @Column(name = "compile_error", columnDefinition = "TEXT")
    private String compileError;

    @Column(name = "runtime_error", columnDefinition = "TEXT")
    private String runtimeError;

    @Column(name = "judge_message", columnDefinition = "TEXT")
    private String judgeMessage;

    public enum ProgrammingLanguage {
        JAVA("java", "javac", ".java"),
        CPP("cpp", "g++", ".cpp"),
        C("c", "gcc", ".c"),
        PYTHON("python", "python", ".py"),
        GO("go", "go", ".go"),
        JAVASCRIPT("javascript", "node", ".js"),
        CSHARP("csharp", "csc", ".cs");

        private final String name;
        private final String compiler;
        private final String extension;

        ProgrammingLanguage(String name, String compiler, String extension) {
            this.name = name;
            this.compiler = compiler;
            this.extension = extension;
        }

        public String getName() {
            return name;
        }

        public String getCompiler() {
            return compiler;
        }

        public String getExtension() {
            return extension;
        }
    }

    public enum SubmissionStatus {
        PENDING,
        COMPILING,
        RUNNING,
        ACCEPTED,
        WRONG_ANSWER,
        TIME_LIMIT_EXCEEDED,
        MEMORY_LIMIT_EXCEEDED,
        RUNTIME_ERROR,
        COMPILE_ERROR,
        PRESENTATION_ERROR,
        SYSTEM_ERROR
    }
}
