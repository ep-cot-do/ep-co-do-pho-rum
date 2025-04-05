package com.fcoder.Fcoder.model.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class EventRecapResponse {
    private Long id;
    private Long eventId;
    private String recapContent;
    private List<String> images;
    private String status;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
}
