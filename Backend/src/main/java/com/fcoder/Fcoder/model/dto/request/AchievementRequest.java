package com.fcoder.Fcoder.model.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;


@Data
public class AchievementRequest {
    @NotNull(message = "User id is required")
    private Long userId;

    @NotNull(message = "Title is required")
    private String title;

    @NotNull(message = "Description is required")
    private String description;

    @NotNull(message = "Image is required")
    private String image;

    @NotNull(message = "Category is required")
    private String category;

    @NotNull(message = "Is active is required")
    private Boolean isActive;
}
