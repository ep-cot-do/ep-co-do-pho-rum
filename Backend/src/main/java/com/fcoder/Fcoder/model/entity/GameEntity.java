package com.fcoder.Fcoder.model.entity;


import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "game")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameEntity extends BaseEntity {
    @ManyToOne(targetEntity = AccountEntity.class, fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "author_id", nullable = false)
    private AccountEntity authorId;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "thumbnail", nullable = false, length = 255)
    private String thumbnail;

    @ElementCollection
    @CollectionTable(name = "game_category", joinColumns = @JoinColumn(name = "game_id"))
    @Column(name = "game_category", length = 255)
    private List<String> category;

    @Column(name = "url", nullable = false, length = 255)
    private String url;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;
}
