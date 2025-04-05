package com.fcoder.Fcoder.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "event_registration")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventRegistrationEntity extends BaseEntity {

    @ManyToOne(targetEntity = EventEntity.class, fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "event_id", nullable = false)
    private EventEntity event;

    @ManyToOne(targetEntity = AccountEntity.class, fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "user_id", nullable = false)
    private AccountEntity user;

    @Column(name = "role", nullable = false)
    private String role;

    @Column(name = "is_active", nullable = false)
    private boolean isActive;
}
