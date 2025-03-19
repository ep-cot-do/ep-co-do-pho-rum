package com.fcoder.Fcoder.model.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class GameResponse {
    private Long id;
    private Long authorId;
    private String title;
    private String description;
    private String thumbnail;
    private String url;
    private List<String> category;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    private Boolean isActive;
}
