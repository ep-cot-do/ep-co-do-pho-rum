package com.fcoder.Fcoder.controller;

import com.fcoder.Fcoder.model.dto.request.SubmissionRequest;
import com.fcoder.Fcoder.model.dto.response.PaginationWrapper;
import com.fcoder.Fcoder.model.dto.response.ResponseObject;
import com.fcoder.Fcoder.model.dto.response.SubmissionResponse;
import com.fcoder.Fcoder.model.dto.response.UserSubmissionStatsResponse;
import com.fcoder.Fcoder.model.entity.SubmissionEntity;
import com.fcoder.Fcoder.service.SubmissionService;
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
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;

    @PostMapping
    @Operation(summary = "Submit a solution", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ResponseObject<SubmissionResponse>> submitSolution(
            @Valid @RequestBody SubmissionRequest request,
            Authentication authentication) {

        try {
            String username = authentication.getName();

            SubmissionResponse result = submissionService.submitSolution(request, username);


            return ResponseEntity.ok(new ResponseObject.Builder<SubmissionResponse>()
                    .success(true)
                    .code("SUCCESS")
                    .content(result)
                    .message("Solution submitted successfully")
                    .build());

        } catch (Exception e) {

            // Return error response instead of hanging
            SubmissionResponse errorResponse = SubmissionResponse.builder()
                    .status(SubmissionEntity.SubmissionStatus.SYSTEM_ERROR)
                    .compileError("Controller error: " + e.getMessage())
                    .passedTests(0)
                    .totalTests(0)
                    .score(0.0)
                    .build();

            return ResponseEntity.ok(new ResponseObject.Builder<SubmissionResponse>()
                    .success(false)
                    .code("ERROR")
                    .content(errorResponse)
                    .message("Submission failed: " + e.getMessage())
                    .build());
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get submission by ID", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ResponseObject<SubmissionResponse>> getSubmissionById(@PathVariable Long id) {
        SubmissionResponse result = submissionService.getSubmissionById(id);
        return ResponseEntity.ok(new ResponseObject.Builder<SubmissionResponse>()
                .success(true)
                .code("SUCCESS")
                .content(result)
                .message("Submission retrieved successfully")
                .build());
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get submissions by user", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ResponseObject<PaginationWrapper<List<SubmissionResponse>>>> getSubmissionsByUser(
            @PathVariable Long userId,
            @PageableDefault(size = 20) Pageable pageable) {
        PaginationWrapper<List<SubmissionResponse>> result = submissionService.getSubmissionsByUser(userId, pageable);
        return ResponseEntity.ok(new ResponseObject.Builder<PaginationWrapper<List<SubmissionResponse>>>()
                .success(true)
                .code("SUCCESS")
                .content(result)
                .message("Submissions retrieved successfully")
                .build());
    }

    @GetMapping("/problem/{problemId}")
    @Operation(summary = "Get submissions by problem")
    public ResponseEntity<ResponseObject<PaginationWrapper<List<SubmissionResponse>>>> getSubmissionsByProblem(
            @PathVariable Long problemId,
            @PageableDefault(size = 20) Pageable pageable) {
        PaginationWrapper<List<SubmissionResponse>> result = submissionService.getSubmissionsByProblem(problemId,
                pageable);
        return ResponseEntity.ok(new ResponseObject.Builder<PaginationWrapper<List<SubmissionResponse>>>()
                .success(true)
                .code("SUCCESS")
                .content(result)
                .message("Submissions retrieved successfully")
                .build());
    }

    @GetMapping("/user/{userId}/problem/{problemId}")
    @Operation(summary = "Get submissions by user and problem", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ResponseObject<PaginationWrapper<List<SubmissionResponse>>>> getSubmissionsByUserAndProblem(
            @PathVariable Long userId,
            @PathVariable Long problemId,
            @PageableDefault(size = 20) Pageable pageable) {
        PaginationWrapper<List<SubmissionResponse>> result = submissionService.getSubmissionsByUserAndProblem(userId,
                problemId, pageable);
        return ResponseEntity.ok(new ResponseObject.Builder<PaginationWrapper<List<SubmissionResponse>>>()
                .success(true)
                .code("SUCCESS")
                .content(result)
                .message("Submissions retrieved successfully")
                .build());
    }

    @GetMapping("/user/{userId}/problem/{problemId}/accepted")
    @Operation(summary = "Get accepted submissions by user and problem", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ResponseObject<List<SubmissionResponse>>> getAcceptedSubmissionsByUserAndProblem(
            @PathVariable Long userId,
            @PathVariable Long problemId) {
        List<SubmissionResponse> result = submissionService.getAcceptedSubmissionsByUserAndProblem(userId, problemId);
        return ResponseEntity.ok(new ResponseObject.Builder<List<SubmissionResponse>>()
                .success(true)
                .code("SUCCESS")
                .content(result)
                .message("Accepted submissions retrieved successfully")
                .build());
    }

    @GetMapping("/user/{userId}/stats")
    @Operation(summary = "Get user submission statistics", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ResponseObject<UserSubmissionStatsResponse>> getUserStats(@PathVariable Long userId) {
        Integer acceptedCount = submissionService.getUserAcceptedCount(userId);
        Integer solvedProblems = submissionService.getUserSolvedProblemsCount(userId);

        UserSubmissionStatsResponse stats = new UserSubmissionStatsResponse(acceptedCount, solvedProblems);

        return ResponseEntity.ok(new ResponseObject.Builder<UserSubmissionStatsResponse>()
                .success(true)
                .code("SUCCESS")
                .content(stats)
                .message("User statistics retrieved successfully")
                .build());
    }
}
