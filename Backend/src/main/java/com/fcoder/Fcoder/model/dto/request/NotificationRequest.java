package com.fcoder.Fcoder.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class NotificationRequest {
    @NotNull(message = "Account id is empty")
    private Long accountId;
    @NotNull(message = "Title is empty")
    private String title;
    @NotNull(message = "Content is empty")
    private String content;
}
