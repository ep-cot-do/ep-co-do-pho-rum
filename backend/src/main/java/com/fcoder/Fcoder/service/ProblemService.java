package com.fcoder.Fcoder.service;

import com.fcoder.Fcoder.model.dto.request.QueryWrapper;
import com.fcoder.Fcoder.model.dto.request.ProblemRequest;
import com.fcoder.Fcoder.model.dto.response.PaginationWrapper;
import com.fcoder.Fcoder.model.dto.response.ProblemResponse;
import com.fcoder.Fcoder.model.entity.ProblemEntity;

import java.util.List;

public interface ProblemService {

    // Core CRUD operations
    ProblemResponse createProblem(ProblemRequest request);

    ProblemResponse updateProblem(Long id, ProblemRequest request);

    ProblemResponse getProblemById(Long id);

    PaginationWrapper<List<ProblemResponse>> getAllProblems(QueryWrapper queryWrapper);

    void deleteProblem(Long id);

    // Status management
    void activateProblem(Long id);

    void deactivateProblem(Long id);

    // Filtering and search
    List<ProblemResponse> filterProblems(String title, String category,
                                         ProblemEntity.ProblemDifficulty difficulty,
                                         String tag, String status, Long authorId);

    PaginationWrapper<List<ProblemResponse>> getProblemsByDifficulty(
            ProblemEntity.ProblemDifficulty difficulty, QueryWrapper queryWrapper);

    PaginationWrapper<List<ProblemResponse>> getProblemsByCategory(String category, QueryWrapper queryWrapper);

    PaginationWrapper<List<ProblemResponse>> getProblemsByTag(String tag, QueryWrapper queryWrapper);

    // User-specific operations
    List<ProblemResponse> getMyProblems();
}