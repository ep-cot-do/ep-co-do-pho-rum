package com.fcoder.Fcoder.service;

import com.fcoder.Fcoder.model.dto.request.SubmissionRequest;
import com.fcoder.Fcoder.model.dto.response.PaginationWrapper;
import com.fcoder.Fcoder.model.dto.response.SubmissionResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface SubmissionService {

    SubmissionResponse submitSolution(SubmissionRequest request, String username);

    SubmissionResponse getSubmissionById(Long id);

    PaginationWrapper<List<SubmissionResponse>> getSubmissionsByUser(Long userId, Pageable pageable);

    PaginationWrapper<List<SubmissionResponse>> getSubmissionsByProblem(Long problemId, Pageable pageable);

    PaginationWrapper<List<SubmissionResponse>> getSubmissionsByUserAndProblem(
            Long userId, Long problemId, Pageable pageable);

    List<SubmissionResponse> getAcceptedSubmissionsByUserAndProblem(Long userId, Long problemId);

    SubmissionResponse getLatestAcceptedSubmission(Long userId, Long problemId);

    void processSubmission(Long submissionId);

    void processPendingSubmissions();

    Integer getUserAcceptedCount(Long userId);

    Integer getUserSolvedProblemsCount(Long userId);

    boolean hasUserSolvedProblem(Long userId, Long problemId);
}
