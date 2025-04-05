package com.fcoder.Fcoder.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "event")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventEntity extends BaseEntity {

    @ManyToOne(targetEntity = AccountEntity.class, fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "organizer", nullable = false)
    private AccountEntity organizer;

    @Column(name = "type", nullable = false, length = 255)
    private String type;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "location", length = 255, nullable = false)
    private String location;

    @Column(name = "event_start_date", nullable = false)
    private LocalDate eventStartDate;

    @Column(name = "event_end_date", nullable = false)
    private LocalDate eventEndDate;

    @Column(name = "max_participants", nullable = false)
    private Integer maxParticipants;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "document_link", length = 255, nullable = false)
    private String documentLink;

    @Column(name = "event_image", length = 255, nullable = false)
    private String eventImage;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<EventRegistrationEntity> registrations;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;
}
