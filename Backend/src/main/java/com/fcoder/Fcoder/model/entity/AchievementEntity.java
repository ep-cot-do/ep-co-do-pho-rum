package com.fcoder.Fcoder.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "achievement")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AchievementEntity extends BaseEntity{

    @OneToOne(targetEntity = AccountEntity.class, fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "user_id", nullable = false)
    private AccountEntity userId;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "description", nullable = false, length = 255)
    private String description;

    @Column(name = "image", nullable = false, length = 255)
    private String image;

    @Column(name = "category", nullable = false, length = 255)
    private String category;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;
}
