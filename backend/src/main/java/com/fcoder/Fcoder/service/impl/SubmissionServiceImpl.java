package com.fcoder.Fcoder.service.impl;

import com.fcoder.Fcoder.model.dto.request.SubmissionRequest;
import com.fcoder.Fcoder.model.dto.response.PaginationWrapper;
import com.fcoder.Fcoder.model.dto.response.SubmissionResponse;
import com.fcoder.Fcoder.model.entity.AccountEntity;
import com.fcoder.Fcoder.model.entity.ProblemEntity;
import com.fcoder.Fcoder.model.entity.SubmissionEntity;
import com.fcoder.Fcoder.model.entity.TestCaseEntity;
import com.fcoder.Fcoder.model.other.ExecutionResult;
import com.fcoder.Fcoder.model.other.TestCaseResult;
import com.fcoder.Fcoder.repository.AccountRepository;
import com.fcoder.Fcoder.repository.ProblemRepository;
import com.fcoder.Fcoder.repository.SubmissionRepository;
import com.fcoder.Fcoder.repository.TestCaseRepository;
import com.fcoder.Fcoder.service.CodeExecutionService;
import com.fcoder.Fcoder.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SubmissionServiceImpl implements SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository;
    private final AccountRepository accountRepository;
    private final TestCaseRepository testCaseRepository;
    private final CodeExecutionService codeExecutionService;

    @Override
    public SubmissionResponse submitSolution(SubmissionRequest request, String username) {
        // Find user
        AccountEntity user = accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        // Find problem
        ProblemEntity problem = problemRepository.findById(request.getProblemId())
                .orElseThrow(() -> new RuntimeException("Problem not found: " + request.getProblemId()));

        // Get test cases
        List<TestCaseEntity> testCases = testCaseRepository.findByProblem_IdAndIsActiveTrueOrderByTestOrder(request.getProblemId());

        // Create submission entity
        SubmissionEntity submission = SubmissionEntity.builder()
                .problem(problem)
                .user(user)
                .sourceCode(request.getSourceCode())
                .language(request.getLanguage())
                .status(SubmissionEntity.SubmissionStatus.PENDING)
                .submissionTime(LocalDateTime.now())
                .build();

        // Save submission first
        submission = submissionRepository.save(submission);

        try {
            // Execute code
            ExecutionResult result = codeExecutionService.executeCode(
                    request.getSourceCode(),
                    request.getLanguage(),
                    testCases,
                    problem.getTimeLimit(),
                    problem.getMemoryLimit());

            // Update submission with results
            submission.setStatus(result.getStatus());
            submission.setExecutionTime((int) result.getExecutionTime());
            submission.setMemoryUsed((int) result.getMemoryUsed());
            submission.setCompileError(result.getErrorMessage());

            // Calculate score - FIX: Handle null testResults
            List<TestCaseResult> testResults = result.getTestResults();
            int passedTests = 0;
            int totalTests = testCases.size();

            if (testResults != null && !testResults.isEmpty()) {
                passedTests = (int) testResults.stream()
                        .mapToLong(tr -> tr.isPassed() ? 1 : 0)
                        .sum();
                totalTests = testResults.size(); // Use actual test results size
            }

            // Set test counts
            submission.setPassedTests(passedTests);
            submission.setTotalTests(totalTests);

            // Calculate score (avoid division by zero)
            double score = totalTests > 0 ? (double) passedTests / totalTests * 100 : 0.0;
            submission.setScore(score);

            submission = submissionRepository.save(submission);

        } catch (Exception e) {
            submission.setStatus(SubmissionEntity.SubmissionStatus.SYSTEM_ERROR);
            submission.setCompileError("System error: " + e.getMessage());
            submission.setPassedTests(0);
            submission.setTotalTests(testCases.size());
            submission.setScore(0.0);
            submission = submissionRepository.save(submission);
        }

        return convertToResponse(submission);
    }

    @Override
    public SubmissionResponse getSubmissionById(Long id) {
        SubmissionEntity submission = submissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Submission not found: " + id));
        return convertToResponse(submission);
    }

    @Override
    public PaginationWrapper<List<SubmissionResponse>> getSubmissionsByUser(Long userId, Pageable pageable) {
        Page<SubmissionEntity> submissions = submissionRepository.findByUser_IdOrderByCreatedDateDesc(userId, pageable);
        List<SubmissionResponse> responseList = submissions.getContent().stream()
                .map(this::convertToResponse)
                .toList();
        return new PaginationWrapper.Builder<List<SubmissionResponse>>()
                .setPaginationInfo(submissions)
                .setData(responseList)
                .build();
    }

    @Override
    public PaginationWrapper<List<SubmissionResponse>> getSubmissionsByProblem(Long problemId, Pageable pageable) {
        Page<SubmissionEntity> submissions = submissionRepository.findByProblem_IdOrderByCreatedDateDesc(problemId,
                pageable);
        List<SubmissionResponse> responseList = submissions.getContent().stream()
                .map(this::convertToResponse)
                .toList();
        return new PaginationWrapper.Builder<List<SubmissionResponse>>()
                .setPaginationInfo(submissions)
                .setData(responseList)
                .build();
    }

    @Override
    public PaginationWrapper<List<SubmissionResponse>> getSubmissionsByUserAndProblem(Long userId, Long problemId,
                                                                                      Pageable pageable) {
        Page<SubmissionEntity> submissions = submissionRepository
                .findByUser_IdAndProblem_IdOrderByCreatedDateDesc(userId, problemId, pageable);
        List<SubmissionResponse> responseList = submissions.getContent().stream()
                .map(this::convertToResponse)
                .toList();
        return new PaginationWrapper.Builder<List<SubmissionResponse>>()
                .setPaginationInfo(submissions)
                .setData(responseList)
                .build();
    }

    @Override
    public List<SubmissionResponse> getAcceptedSubmissionsByUserAndProblem(Long userId, Long problemId) {
        List<SubmissionEntity> submissions = submissionRepository
                .findByUser_IdAndProblem_IdAndStatusOrderByCreatedDateDesc(
                        userId, problemId, SubmissionEntity.SubmissionStatus.ACCEPTED);
        return submissions.stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public SubmissionResponse getLatestAcceptedSubmission(Long userId, Long problemId) {
        return submissionRepository.findFirstByUser_IdAndProblem_IdAndStatusOrderByCreatedDateDesc(
                        userId, problemId, SubmissionEntity.SubmissionStatus.ACCEPTED)
                .map(this::convertToResponse)
                .orElse(null);
    }

    @Override
    public void processSubmission(Long submissionId) {
        // Implementation for processing a specific submission
        // This would typically involve judging the submission
        SubmissionEntity submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found: " + submissionId));

        // TODO: Implement actual submission processing logic
        // This might involve re-running the code execution service
    }

    @Override
    public void processPendingSubmissions() {
        // Get all pending submissions and process them
        List<SubmissionEntity> pendingSubmissions = submissionRepository.findPendingSubmissions();
        for (SubmissionEntity submission : pendingSubmissions) {
            processSubmission(submission.getId());
        }
    }

    @Override
    public Integer getUserAcceptedCount(Long userId) {
        return submissionRepository.countAcceptedSubmissionsByUserId(userId);
    }

    @Override
    public Integer getUserSolvedProblemsCount(Long userId) {
        return submissionRepository.countSolvedProblemsByUserId(userId);
    }

    @Override
    public boolean hasUserSolvedProblem(Long userId, Long problemId) {
        return submissionRepository.existsByUser_IdAndProblem_IdAndStatus(userId, problemId,
                SubmissionEntity.SubmissionStatus.ACCEPTED);
    }

    private SubmissionResponse convertToResponse(SubmissionEntity submission) {
        return SubmissionResponse.builder()
                .id(submission.getId())
                .problemId(submission.getProblem().getId())
                .problemTitle(submission.getProblem().getTitle())
                .username(submission.getUser().getUsername())
                .language(submission.getLanguage())
                .status(submission.getStatus())
                .executionTime(submission.getExecutionTime())
                .memoryUsed(submission.getMemoryUsed())
                .passedTests(submission.getPassedTests())
                .totalTests(submission.getTotalTests())
                .score(submission.getScore())
                .compileError(submission.getCompileError())
                .runtimeError(submission.getRuntimeError())
                .judgeMessage(submission.getJudgeMessage())
                .submittedAt(submission.getCreatedDate())
                .build();
    }
}