package com.fcoder.Fcoder.model.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class LibraryResponse {
    private Long id;
    private String authorId;
    private int semester;
    private String major;
    private String description;
    private String url;
    private String thumbnail;
    private String type;
    private String status;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
}
