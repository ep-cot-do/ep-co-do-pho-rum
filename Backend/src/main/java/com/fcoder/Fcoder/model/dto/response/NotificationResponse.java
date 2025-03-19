package com.fcoder.Fcoder.model.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class NotificationResponse {
    private Long id;
    private Long accountId;
    private String title;
    private String content;
    private boolean isRead;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    private boolean isActive;
}
