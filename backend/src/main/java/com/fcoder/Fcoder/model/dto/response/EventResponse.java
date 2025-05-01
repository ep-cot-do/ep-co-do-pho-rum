package com.fcoder.Fcoder.model.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class EventResponse {
    private Long id;
    private Long organizerId;
    private String title;
    private String description;
    private String location;
    private LocalDate eventStartDate;
    private LocalDate eventEndDate;
    private Long maxParticipant;
    private String status;
    private String type;
    private String eventImage;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    private boolean isActive;
}
