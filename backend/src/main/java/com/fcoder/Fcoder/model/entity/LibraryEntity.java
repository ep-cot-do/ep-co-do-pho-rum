package com.fcoder.Fcoder.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "library")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LibraryEntity extends BaseEntity {
    @ManyToOne(targetEntity = AccountEntity.class, fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "author_id", nullable = false)
    private AccountEntity authorId;

    @Column(name = "semester", nullable = false)
    private int semester;

    @Column(name = "major", nullable = false, length = 255)
    private String major;

    @Column(name = "subject_code", nullable = false, length = 10)
    private String subjectCode;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "url", nullable = false)
    private String url;

    @Column(name = "thumbnail", nullable = false)
    private String thumbnail;

    @Column(name = "type", nullable = false)
    private String type;

    @Column(name = "status", nullable = false)
    private String status;

}
