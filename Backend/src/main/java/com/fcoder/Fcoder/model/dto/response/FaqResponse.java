package com.fcoder.Fcoder.model.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class FaqResponse {
    private Long id;
    private String question;
    private String answer;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    private boolean isActive;
}