package com.fcoder.Fcoder.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "event_recap")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventRecapEntity extends BaseEntity {

    @ManyToOne(targetEntity = EventEntity.class, fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "event_id", nullable = false)
    private EventEntity event;

    @Column(name = "recap_content", columnDefinition = "TEXT", nullable = false)
    private String recapContent;

    @ElementCollection
    @CollectionTable(name = "event_recap_images", joinColumns = @JoinColumn(name = "recap_id"))
    @Column(name = "image_url", length = 255)
    private List<String> images = new ArrayList<>();

    @Column(name = "status", nullable = false, length = 50)
    private String status;

}
