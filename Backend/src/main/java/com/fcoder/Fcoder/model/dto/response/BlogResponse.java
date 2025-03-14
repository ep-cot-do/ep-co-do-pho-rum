package com.fcoder.Fcoder.model.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class BlogResponse {
    private Long id;
    private String authorName;
    private String title;
    private String description;
    private String content;
    private String thumbnail;
    private String category;
    private List<String> images;
    private Integer view;
    private Integer likes;
    private String status;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
}
