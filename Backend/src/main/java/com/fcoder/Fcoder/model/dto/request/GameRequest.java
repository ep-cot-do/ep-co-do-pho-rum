package com.fcoder.Fcoder.model.dto.request;

import com.fcoder.Fcoder.model.entity.GameEntity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class GameRequest {
    @NotNull(message = "Author ID is required")
    private Long authorId;
    @NotBlank(message = "Title is required")
    private String title;
    @NotBlank(message = "Description is required")
    private String description;
    @NotBlank(message = "Thumbnail is required")
    private String thumbnail;
    @NotNull(message = "URL is required")
    private String url;
    @NotNull(message = "Category is required")
    private List<String> category;
}
