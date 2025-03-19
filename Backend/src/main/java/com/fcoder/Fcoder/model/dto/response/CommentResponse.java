package com.fcoder.Fcoder.model.dto.response;

import com.fcoder.Fcoder.model.entity.CommentEntity;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class CommentResponse {
    private Long id;
    private Long userId;
    private Long blogId;
    private Long parentId;
    private String content;
    private List<CommentResponse> replies;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    private boolean isActive;
}

