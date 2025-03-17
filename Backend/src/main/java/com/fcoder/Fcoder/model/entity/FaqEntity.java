package com.fcoder.Fcoder.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "faq")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FaqEntity extends BaseEntity {

    @Column(name = "question", nullable = false)
    private String question;

    @Column(name = "answer", nullable = false)
    private String answer;

    @Column(name = "is_active", nullable = false)
    private boolean isActive;

}