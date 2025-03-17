package com.fcoder.Fcoder.service.impl;

import com.fcoder.Fcoder.model.dto.request.CommentRequest;
import com.fcoder.Fcoder.model.dto.request.QueryWrapper;
import com.fcoder.Fcoder.model.dto.response.CommentResponse;
import com.fcoder.Fcoder.model.dto.response.PaginationWrapper;
import com.fcoder.Fcoder.model.entity.CommentEntity;
import com.fcoder.Fcoder.model.exception.ActionFailedException;
import com.fcoder.Fcoder.model.exception.ValidationException;
import com.fcoder.Fcoder.repository.AccountRepository;
import com.fcoder.Fcoder.repository.BlogRepository;
import com.fcoder.Fcoder.repository.CommentRepository;
import com.fcoder.Fcoder.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final BlogRepository blogRepository;
    private final AccountRepository accountRepository;

    @Override
    public PaginationWrapper<List<CommentResponse>> getAllComments(QueryWrapper queryWrapper) {
        return commentRepository.query(queryWrapper,
                commentRepository::queryAnySpecification,
                (items) -> {
                    var list = items.map(this::convertToResponse).toList();
                    return new PaginationWrapper.Builder<List<CommentResponse>>()
                            .setPaginationInfo(items)
                            .setData(list)
                            .build();
                });
    }

    @Override
    public CommentResponse getCommentById(Long id) {
        var comment = commentRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Comment not found"));
        return convertToResponse(comment);
    }

    @Transactional
    @Override
    public CommentResponse createComment(CommentRequest commentRequest) {
        var blog = blogRepository.findById(commentRequest.getBlogId())
                .orElseThrow(() -> new ValidationException("Blog not found"));
        var user = accountRepository.findById(commentRequest.getUserId())
                .orElseThrow(() -> new ValidationException("User not found"));

        CommentEntity parentComment = null;
        if (commentRequest.getParentId() != null) {
            parentComment = commentRepository.findById(commentRequest.getParentId())
                    .orElseThrow(() -> new ValidationException("Parent comment not found"));
        }

        var comment = CommentEntity.builder()
                .blogId(blog)
                .userId(user)
                .content(commentRequest.getContent())
                .parentComment(parentComment)
                .isActive(true)
                .build();

        return convertToResponse(commentRepository.save(comment));
    }

    @Transactional
    @Override
    public CommentResponse updateComment(Long id, CommentRequest commentRequest) {
        var comment = commentRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Comment not found"));

        comment.setContent(commentRequest.getContent());
        comment.setUpdatedDate(LocalDateTime.now());

        return convertToResponse(commentRepository.save(comment));
    }

    @Transactional
    @Override
    public void deleteComment(Long id) {
        if (!commentRepository.existsById(id)) {
            throw new ValidationException("Comment not found");
        }
        try {
            commentRepository.deleteById(id);
        } catch (Exception ex) {
            throw new ActionFailedException("Failed to delete comment", ex);
        }
    }

    @Transactional
    @Override
    public void hideComment(Long id, Long requestUserId) {
        var comment = commentRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Comment not found"));

        comment.setIsActive(false);
        commentRepository.save(comment);
    }

    @Transactional
    @Override
    public void showComment(Long id) {
        var comment = commentRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Comment not found"));

        comment.setIsActive(true);
        commentRepository.save(comment);
    }

    private CommentResponse convertToResponse(CommentEntity comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .userId(comment.getUserId().getId())
                .blogId(comment.getBlogId().getId())
                .parentId(comment.getParentComment() != null ? comment.getParentComment().getId() : null)
                .content(comment.getContent())
                .replies(comment.getReplies().stream().map(this::convertToResponse).toList())
                .createdDate(comment.getCreatedDate())
                .updatedDate(comment.getUpdatedDate())
                .isActive(comment.getIsActive())
                .build();
    }
}
