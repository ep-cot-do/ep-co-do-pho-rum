package com.fcoder.Fcoder.model.dto.request;

import com.fcoder.Fcoder.model.entity.CommentEntity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CommentRequest {
    @NotNull(message = "Blog id is required")
    private Long blogId;
    @NotNull(message = "User id is required")
    private Long userId;
    @NotNull(message = "Parent id is required")
    private Long parentId;
    @NotBlank(message = "Content is required")
    private String content;
    private List<CommentEntity> replies;
}
