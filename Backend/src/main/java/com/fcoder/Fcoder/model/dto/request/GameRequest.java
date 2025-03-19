package com.fcoder.Fcoder.model.dto.request;

import com.fcoder.Fcoder.model.entity.GameEntity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class GameRequest {
    private Long authorId;
    private String title;
    private String description;
    private String thumbnail;
    private String url;
    private List<String> category;
}
