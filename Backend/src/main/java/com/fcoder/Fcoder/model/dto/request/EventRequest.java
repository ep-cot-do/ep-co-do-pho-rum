package com.fcoder.Fcoder.model.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class EventRequest {
    @NotNull(message = "Organizer id shouldn't be empty")
    private Long organizerId;
    @NotNull(message = "Type shouldn't be empty")
    private String type;
    @NotNull(message = "Title shouldn't be empty")
    private String title;
    @NotNull(message = "Description shouldn't be empty")
    private String description;
    @NotNull(message = "Location shouldn't be empty")
    private String location;
    @NotNull(message = "Event start date shouldn't be empty")
    private LocalDate eventStartDate;
    @NotNull(message = "Event end date shouldn't be empty")
    private LocalDate eventEndDate;
    @NotNull(message = "Max participant shouldn't be empty")
    private Long maxParticipant;
    @NotNull(message = "Event image shouldn't be empty")
    private String eventImg;
    @NotNull(message = "Status date shouldn't be empty")
    private String status;
    @NotNull(message = "Document Link shouldn't be empty")
    private String documentLink;
}
