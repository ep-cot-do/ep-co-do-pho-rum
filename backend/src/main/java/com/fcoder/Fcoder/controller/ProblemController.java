package com.fcoder.Fcoder.controller;

import com.fcoder.Fcoder.model.dto.request.ProblemRequest;
import com.fcoder.Fcoder.model.dto.response.PaginationWrapper;
import com.fcoder.Fcoder.model.dto.response.ProblemResponse;
import com.fcoder.Fcoder.model.dto.response.ResponseObject;
import com.fcoder.Fcoder.model.entity.ProblemEntity;
import com.fcoder.Fcoder.service.ProblemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/problems")
@RequiredArgsConstructor
public class ProblemController {

    private final ProblemService problemService;

    @PostMapping
    @Operation(summary = "Create a new problem", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ResponseObject<ProblemResponse>> createProblem(
            @Valid @RequestBody ProblemRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        ProblemResponse result = problemService.createProblem(request, username);
        return ResponseEntity.ok(new ResponseObject.Builder<ProblemResponse>()
                .success(true)
                .code("SUCCESS")
                .content(result)
                .message("Problem created successfully")
                .build());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a problem", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ResponseObject<ProblemResponse>> updateProblem(
            @PathVariable Long id,
            @Valid @RequestBody ProblemRequest request) {
        ProblemResponse result = problemService.updateProblem(id, request);
        return ResponseEntity.ok(new ResponseObject.Builder<ProblemResponse>()
                .success(true)
                .code("SUCCESS")
                .content(result)
                .message("Problem updated successfully")
                .build());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get problem by ID")
    public ResponseEntity<ResponseObject<ProblemResponse>> getProblemById(@PathVariable Long id) {
        ProblemResponse result = problemService.getProblemById(id);
        return ResponseEntity.ok(new ResponseObject.Builder<ProblemResponse>()
                .success(true)
                .code("SUCCESS")
                .content(result)
                .message("Problem retrieved successfully")
                .build());
    }

    @GetMapping
    @Operation(summary = "Get all problems")
    public ResponseEntity<ResponseObject<PaginationWrapper<List<ProblemResponse>>>> getAllProblems(
            @PageableDefault(size = 20) Pageable pageable) {
        PaginationWrapper<List<ProblemResponse>> result = problemService.getAllProblems(pageable);
        return ResponseEntity.ok(new ResponseObject.Builder<PaginationWrapper<List<ProblemResponse>>>()
                .success(true)
                .code("SUCCESS")
                .content(result)
                .message("Problems retrieved successfully")
                .build());
    }

    @GetMapping("/difficulty/{difficulty}")
    @Operation(summary = "Get problems by difficulty")
    public ResponseEntity<ResponseObject<PaginationWrapper<List<ProblemResponse>>>> getProblemsByDifficulty(
            @PathVariable ProblemEntity.ProblemDifficulty difficulty,
            @PageableDefault(size = 20) Pageable pageable) {
        PaginationWrapper<List<ProblemResponse>> result = problemService.getProblemsByDifficulty(difficulty, pageable);
        return ResponseEntity.ok(new ResponseObject.Builder<PaginationWrapper<List<ProblemResponse>>>()
                .success(true)
                .code("SUCCESS")
                .content(result)
                .message("Problems retrieved successfully")
                .build());
    }

    @GetMapping("/category/{category}")
    @Operation(summary = "Get problems by category")
    public ResponseEntity<ResponseObject<PaginationWrapper<List<ProblemResponse>>>> getProblemsByCategory(
            @PathVariable String category,
            @PageableDefault(size = 20) Pageable pageable) {
        PaginationWrapper<List<ProblemResponse>> result = problemService.getProblemsByCategory(category, pageable);
        return ResponseEntity.ok(new ResponseObject.Builder<PaginationWrapper<List<ProblemResponse>>>()
                .success(true)
                .code("SUCCESS")
                .content(result)
                .message("Problems retrieved successfully")
                .build());
    }

    @GetMapping("/search")
    @Operation(summary = "Search problems")
    public ResponseEntity<ResponseObject<PaginationWrapper<List<ProblemResponse>>>> searchProblems(
            @RequestParam String keyword,
            @PageableDefault(size = 20) Pageable pageable) {
        PaginationWrapper<List<ProblemResponse>> result = problemService.searchProblems(keyword, pageable);
        return ResponseEntity.ok(new ResponseObject.Builder<PaginationWrapper<List<ProblemResponse>>>()
                .success(true)
                .code("SUCCESS")
                .content(result)
                .message("Problems retrieved successfully")
                .build());
    }

    @GetMapping("/tag/{tag}")
    @Operation(summary = "Get problems by tag")
    public ResponseEntity<ResponseObject<PaginationWrapper<List<ProblemResponse>>>> getProblemsByTag(
            @PathVariable String tag,
            @PageableDefault(size = 20) Pageable pageable) {
        PaginationWrapper<List<ProblemResponse>> result = problemService.getProblemsByTag(tag, pageable);
        return ResponseEntity.ok(new ResponseObject.Builder<PaginationWrapper<List<ProblemResponse>>>()
                .success(true)
                .code("SUCCESS")
                .content(result)
                .message("Problems retrieved successfully")
                .build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a problem", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ResponseObject<Void>> deleteProblem(@PathVariable Long id) {
        problemService.deleteProblem(id);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Problem deleted successfully")
                .build());
    }

    @PatchMapping("/{id}/toggle-status")
    @Operation(summary = "Toggle problem status", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ResponseObject<Void>> toggleProblemStatus(@PathVariable Long id) {
        problemService.toggleProblemStatus(id);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Problem status updated successfully")
                .build());
    }
}
