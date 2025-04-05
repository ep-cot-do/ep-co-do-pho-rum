package com.fcoder.Fcoder.model.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class EventRegistrationResponse {
    private Long id;
    private Long userId;
    private String role;
    private LocalDateTime created_date;
    private LocalDateTime updated_date;
    private boolean isActive;
}
