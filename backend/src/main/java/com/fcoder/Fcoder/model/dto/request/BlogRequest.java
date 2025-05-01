package com.fcoder.Fcoder.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class BlogRequest {
    @NotNull(message = "Author id is required")
    private Long authorId;

    @NotNull(message = "Title is required")
    private String title;

    @NotNull(message = "Content is required")
    @NotBlank(message = "Content is required")
    private String content;

    @NotNull(message = "View is required")
    private Integer view =0;


    @NotNull(message = "Likes is required")
    private Integer likes =0;

    @NotNull(message = "Description is required")
    private String description;

    @NotNull(message = "Status is required")
    private String status;

    @NotNull(message = "Thumbnail is required")
    private String thumbnail;

    @NotNull(message = "Category is required")
    private String category;

    private List<String> images;

    @NotNull(message = "Created date is required")
    private LocalDateTime createdDate;
}
