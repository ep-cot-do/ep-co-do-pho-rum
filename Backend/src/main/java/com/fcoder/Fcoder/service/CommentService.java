package com.fcoder.Fcoder.service;

import com.fcoder.Fcoder.model.dto.request.CommentRequest;
import com.fcoder.Fcoder.model.dto.request.QueryWrapper;
import com.fcoder.Fcoder.model.dto.response.CommentResponse;
import com.fcoder.Fcoder.model.dto.response.PaginationWrapper;

import java.util.List;

public interface CommentService {
    PaginationWrapper<List<CommentResponse>> getAllComments(QueryWrapper queryWrapper);
    CommentResponse getCommentById(Long id);
    CommentResponse createComment(CommentRequest commentRequest);
    CommentResponse updateComment(Long id, CommentRequest commentRequest);
    void deleteComment(Long id);
    void hideComment(Long id, Long requestUserId);
    void showComment(Long id);
}
