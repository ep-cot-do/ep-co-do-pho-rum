package com.fcoder.Fcoder.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "role")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoleEntity extends BaseEntity{
    @Column(name ="role_name", nullable = false,length = 100)
    private String roleName;
}
