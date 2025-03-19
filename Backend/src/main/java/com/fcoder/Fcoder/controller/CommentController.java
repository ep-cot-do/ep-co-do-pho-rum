package com.fcoder.Fcoder.controller;

import com.fcoder.Fcoder.model.dto.request.CommentRequest;
import com.fcoder.Fcoder.model.dto.request.QueryWrapper;
import com.fcoder.Fcoder.model.dto.response.CommentResponse;
import com.fcoder.Fcoder.model.dto.response.PaginationWrapper;
import com.fcoder.Fcoder.model.dto.response.ResponseObject;
import com.fcoder.Fcoder.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/comments", produces = MediaType.APPLICATION_JSON_VALUE)
public class CommentController {
    private final CommentService commentService;

    @GetMapping
    @Operation(summary = "Get all comments")
    public ResponseEntity<ResponseObject<PaginationWrapper<List<CommentResponse>>>> getAllComments(@RequestParam(name = "q", required = false) String query) {
        var result = commentService.getAllComments(QueryWrapper.builder().search(query).build());
        return ResponseEntity.ok(new ResponseObject.Builder<PaginationWrapper<List<CommentResponse>>>()
                .success(true)
                .code("SUCCESS")
                .content(result)
                .message("Comments retrieved successfully")
                .build());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get comment by ID")
    public ResponseEntity<ResponseObject<CommentResponse>> getCommentById(@PathVariable Long id) {
        var comment = commentService.getCommentById(id);
        return ResponseEntity.ok(new ResponseObject.Builder<CommentResponse>()
                .success(true)
                .code("SUCCESS")
                .content(comment)
                .message("Get Success")
                .build());
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Create a new comment", security = {@SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<CommentResponse>> createComment(@RequestBody CommentRequest commentRequest) {
        var comment = commentService.createComment(commentRequest);
        return ResponseEntity.ok(new ResponseObject.Builder<CommentResponse>()
                .success(true)
                .code("SUCCESS")
                .content(comment)
                .message("Create Success")
                .build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Update a comment by ID", security = {@SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<CommentResponse>> updateComment(@PathVariable Long id, @RequestBody CommentRequest commentRequest) {
        var comment = commentService.updateComment(id, commentRequest);
        return ResponseEntity.ok(new ResponseObject.Builder<CommentResponse>()
                .success(true)
                .code("SUCCESS")
                .content(comment)
                .message("Update Success")
                .build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Operation(summary = "Delete a comment by ID (Admin only)", security =
            {@SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<Void>> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Delete Success")
                .build());
    }

    @PatchMapping("/hide/{id}")
    @Operation(summary = "Hide a comment by ID", security = {@SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<Void>> hideComment(@PathVariable Long id, @RequestParam Long requestUserId) {
        commentService.hideComment(id, requestUserId);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Comment hidden successfully")
                .build());
    }

    @PatchMapping("/show/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Operation(summary = "Show a hidden comment by ID", security = {@SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<Void>> showComment(@PathVariable Long id) {
        commentService.showComment(id);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Comment shown successfully")
                .build());
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update a comment by ID", security = {@SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<CommentResponse>> updateCommentDetails(@PathVariable Long id,
                                                                          @RequestBody CommentRequest commentRequest) {
        var comment = commentService.updateComment(id, commentRequest);
        return ResponseEntity.ok(new ResponseObject.Builder<CommentResponse>()
                .success(true)
                .code("SUCCESS")
                .content(comment)
                .message("Update Success")
                .build());
    }
}
