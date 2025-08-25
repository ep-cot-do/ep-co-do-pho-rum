package com.fcoder.Fcoder.controller;

import com.fcoder.Fcoder.model.dto.request.QueryWrapper;
import com.fcoder.Fcoder.model.dto.request.ProblemRequest;
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
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/problems", produces = MediaType.APPLICATION_JSON_VALUE)
public class ProblemController {
    private final ProblemService problemService;

    @GetMapping
    @Operation(summary = "Get all problems", description = "This API will return all problems")
    public ResponseEntity<ResponseObject<List<ProblemResponse>>> getAllProblems(@RequestParam(name = "q", required = false) String query,
                                                                                @PageableDefault(page = 0, size = 20) Pageable pageable) {
        var result = problemService.getAllProblems(QueryWrapper.builder()
                .wrapSort(pageable)
                .search(query)
                .build());
        return ResponseEntity.ok(new ResponseObject.Builder<List<ProblemResponse>>()
                .success(true)
                .code("SUCCESS")
                .unwrapPaginationWrapper(result)
                .message("Problems retrieved successfully")
                .build());
    }

    @Operation(summary = "Get problem by ID")
    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject<ProblemResponse>> getProblemById(@PathVariable Long id) {
        var problem = problemService.getProblemById(id);
        return ResponseEntity.ok(new ResponseObject.Builder<ProblemResponse>()
                .success(true)
                .code("SUCCESS")
                .content(problem)
                .message("Get Success")
                .build());
    }

    @Operation(summary = "Create a new problem (Admin and Header of club only)", security = {@SecurityRequirement(name = "accessCookie")})
    @PostMapping
//    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_HOC')")
    public ResponseEntity<ResponseObject<ProblemResponse>> createProblem(@Valid @RequestBody ProblemRequest problemRequest) {
        var problem = problemService.createProblem(problemRequest);
        System.out.println("problem = " + problem);
        return ResponseEntity.ok(new ResponseObject.Builder<ProblemResponse>()
                .success(true)
                .code("SUCCESS")
                .content(problem)
                .message("Create Success")
                .build());
    }

    @Operation(summary = "Update a problem by ID (Admin and Header of club only)", security = {@SecurityRequirement(name = "accessCookie")})
    @PutMapping("/{id}")
//    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_HOC')")
    public ResponseEntity<ResponseObject<ProblemResponse>> updateProblemDetails(@PathVariable Long id,
                                                                                @Valid @RequestBody ProblemRequest problemRequest) {
        var problem = problemService.updateProblem(id, problemRequest);
        return ResponseEntity.ok(new ResponseObject.Builder<ProblemResponse>()
                .success(true)
                .code("SUCCESS")
                .content(problem)
                .message("Update Success")
                .build());
    }

    @PatchMapping("/{id}")
//    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_HOC')")
    @Operation(summary = "Update a problem by ID (Admin and Header of club only)", security = {@SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<ProblemResponse>> updateProblem(@PathVariable Long id,
                                                                         @Valid @RequestBody ProblemRequest problemRequest) {
        var problem = problemService.updateProblem(id, problemRequest);
        return ResponseEntity.ok(new ResponseObject.Builder<ProblemResponse>()
                .success(true)
                .code("SUCCESS")
                .content(problem)
                .message("Update Success")
                .build());
    }

    @PatchMapping("/activate/{id}")
//    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_HOC')")
    @Operation(summary = "Activate a problem by ID (Admin and Header of club only)", security = {@SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<Void>> activateProblem(@PathVariable Long id) {
        problemService.activateProblem(id);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Activate Success")
                .build());
    }

    @PatchMapping("/deactivate/{id}")
//    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_HOC')")
    @Operation(summary = "Deactivate a problem by ID (Admin and Header of club only)", security = {@SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<Void>> deactivateProblem(@PathVariable Long id) {
        problemService.deactivateProblem(id);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Deactivate Success")
                .build());
    }

    @Operation(summary = "Delete a problem by ID (Admin only)", security = {@SecurityRequirement(name = "accessCookie")})
    @DeleteMapping("/{id}")
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ResponseObject<Void>> deleteProblem(@PathVariable Long id) {
        problemService.deleteProblem(id);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Delete Success")
                .build());
    }

    @GetMapping("/filter")
    @Operation(summary = "Filter problems", security = {@SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<List<ProblemResponse>>>
    filterProblems(@RequestParam(required = false) String title,
                   @RequestParam(required = false) String category,
                   @RequestParam(required = false) ProblemEntity.ProblemDifficulty difficulty,
                   @RequestParam(required = false) String tag,
                   @RequestParam(required = false) String status,
                   @RequestParam(required = false) Long authorId) {
        var problems = problemService.filterProblems(title, category, difficulty, tag, status, authorId);
        return ResponseEntity.ok(new ResponseObject.Builder<List<ProblemResponse>>()
                .success(true)
                .code("SUCCESS")
                .content(problems)
                .message("Filter Success")
                .build());
    }

    @GetMapping("/difficulty/{difficulty}")
    @Operation(summary = "Get problems by difficulty")
    public ResponseEntity<ResponseObject<List<ProblemResponse>>> getProblemsByDifficulty(
            @PathVariable ProblemEntity.ProblemDifficulty difficulty,
            @PageableDefault(page = 0, size = 20) Pageable pageable) {
        var result = problemService.getProblemsByDifficulty(difficulty, QueryWrapper.builder()
                .wrapSort(pageable)
                .build());
        return ResponseEntity.ok(new ResponseObject.Builder<List<ProblemResponse>>()
                .success(true)
                .code("SUCCESS")
                .unwrapPaginationWrapper(result)
                .message("Problems retrieved successfully")
                .build());
    }

    @GetMapping("/category/{category}")
    @Operation(summary = "Get problems by category")
    public ResponseEntity<ResponseObject<List<ProblemResponse>>> getProblemsByCategory(
            @PathVariable String category,
            @PageableDefault(page = 0, size = 20) Pageable pageable) {
        var result = problemService.getProblemsByCategory(category, QueryWrapper.builder()
                .wrapSort(pageable)
                .build());
        return ResponseEntity.ok(new ResponseObject.Builder<List<ProblemResponse>>()
                .success(true)
                .code("SUCCESS")
                .unwrapPaginationWrapper(result)
                .message("Problems retrieved successfully")
                .build());
    }

    @GetMapping("/tag/{tag}")
    @Operation(summary = "Get problems by tag")
    public ResponseEntity<ResponseObject<List<ProblemResponse>>> getProblemsByTag(
            @PathVariable String tag,
            @PageableDefault(page = 0, size = 20) Pageable pageable) {
        var result = problemService.getProblemsByTag(tag, QueryWrapper.builder()
                .wrapSort(pageable)
                .build());
        return ResponseEntity.ok(new ResponseObject.Builder<List<ProblemResponse>>()
                .success(true)
                .code("SUCCESS")
                .unwrapPaginationWrapper(result)
                .message("Problems retrieved successfully")
                .build());
    }

    @GetMapping("/my-problems")
    @Operation(summary = "Get all problems of current user", description = "This API will return all problems of current user")
    public ResponseEntity<ResponseObject<List<ProblemResponse>>> getMyProblems(@PageableDefault(page = 0, size = 20) Pageable pageable) {
        var result = problemService.getMyProblems();
        return ResponseEntity.ok(new ResponseObject.Builder<List<ProblemResponse>>()
                .success(true)
                .code("SUCCESS")
                .content(result)
                .message("Problems retrieved successfully")
                .build());
    }
}