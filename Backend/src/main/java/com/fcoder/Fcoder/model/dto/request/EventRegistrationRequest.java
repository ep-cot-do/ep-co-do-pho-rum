package com.fcoder.Fcoder.model.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class EventRegistrationRequest {
    @NotNull(message = "Event id shouldn't be empty")
    private Long eventId;
    @NotNull(message = "User id shouldn't be empty")
    private Long userId;
    @NotNull(message = "Role shouldn't be empty")
    private String role;
}
