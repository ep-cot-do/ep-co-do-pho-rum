package com.fcoder.Fcoder.service;

import com.fcoder.Fcoder.model.dto.request.ProblemRequest;
import com.fcoder.Fcoder.model.dto.response.PaginationWrapper;
import com.fcoder.Fcoder.model.dto.response.ProblemResponse;
import com.fcoder.Fcoder.model.entity.ProblemEntity;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProblemService {

    ProblemResponse createProblem(ProblemRequest request, String createdBy);

    ProblemResponse updateProblem(Long id, ProblemRequest request);

    ProblemResponse getProblemById(Long id);

    PaginationWrapper<List<ProblemResponse>> getAllProblems(Pageable pageable);

    PaginationWrapper<List<ProblemResponse>> getProblemsByDifficulty(
            ProblemEntity.ProblemDifficulty difficulty, Pageable pageable);

    PaginationWrapper<List<ProblemResponse>> getProblemsByCategory(String category, Pageable pageable);

    PaginationWrapper<List<ProblemResponse>> searchProblems(String keyword, Pageable pageable);

    PaginationWrapper<List<ProblemResponse>> getProblemsByTag(String tag, Pageable pageable);

    List<ProblemResponse> getProblemsByCreator(Long userId);

    void deleteProblem(Long id);

    void toggleProblemStatus(Long id);
}
