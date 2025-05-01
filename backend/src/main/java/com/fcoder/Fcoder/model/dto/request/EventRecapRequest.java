package com.fcoder.Fcoder.model.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class EventRecapRequest {
    private Long eventId;
    private String recapContent;
    private List<String> images;
    private String status;
}
