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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

        private static final Logger log = LoggerFactory.getLogger(SubmissionServiceImpl.class);

        private final SubmissionRepository submissionRepository;
        private final ProblemRepository problemRepository;
        private final AccountRepository accountRepository;
        private final TestCaseRepository testCaseRepository;
        private final CodeExecutionService codeExecutionService;

        @Override
        public SubmissionResponse submitSolution(SubmissionRequest request, String username) {
                log.info("Processing submission for user: {}, problem: {}, language: {}", 
                        username, request.getProblemId(), request.getLanguage());
                
                try {
                        // Validate and get entities
                        AccountEntity user = accountRepository.findByUsername(username)
                                        .orElseThrow(() -> new RuntimeException("User not found: " + username));
                        
                        ProblemEntity problem = problemRepository.findById(request.getProblemId())
                                        .orElseThrow(() -> new RuntimeException("Problem not found: " + request.getProblemId()));
                        
                        List<TestCaseEntity> testCases = testCaseRepository.findByProblem_IdAndIsActiveTrueOrderByTestOrder(request.getProblemId());
                        if (testCases.isEmpty()) {
                                throw new RuntimeException("No test cases found for problem: " + request.getProblemId());
                        }
                        
                        // Create submission entity
                        SubmissionEntity submission = SubmissionEntity.builder()
                                        .user(user)
                                        .problem(problem)
                                        .sourceCode(request.getSourceCode())
                                        .language(request.getLanguage())
                                        .status(SubmissionEntity.SubmissionStatus.PENDING)
                                        .submissionTime(LocalDateTime.now())
                                        .passedTests(0)
                                        .totalTests(testCases.size())
                                        .score(0.0)
                                        .build();
                        
                        // Save initial submission
                        submission = submissionRepository.save(submission);
                        log.info("Created submission with ID: {}", submission.getId());
                        
                        // Execute code safely
                        return executeCodeSafely(request, submission, testCases, problem);
                        
                } catch (Exception e) {
                        log.error("Error processing submission for user: {}, problem: {}", 
                                username, request.getProblemId(), e);
                        throw new RuntimeException("Failed to process submission: " + e.getMessage(), e);
                }
        }

        private SubmissionResponse executeCodeSafely(SubmissionRequest request,
                                                     SubmissionEntity submission,
                                                     List<TestCaseEntity> testCases,
                                                     ProblemEntity problem) {
                try {
                        log.info("Starting code execution for submission: {}", submission.getId());

                        // Update status to COMPILING
                        submission.setStatus(SubmissionEntity.SubmissionStatus.COMPILING);
                        submission = submissionRepository.save(submission);

                        // Set timeout for the entire submission process
                        long startTime = System.currentTimeMillis();
                        long maxExecutionTime = 60000; // 60 seconds max

                        // Execute code using Docker-based service
                        ExecutionResult result = codeExecutionService.executeCode(
                                request.getSourceCode(),
                                request.getLanguage(),
                                testCases,
                                problem.getTimeLimit(),
                                problem.getMemoryLimit());

                        long totalTime = System.currentTimeMillis() - startTime;

                        // Check for timeout
                        if (totalTime > maxExecutionTime) {
                                log.warn("Submission {} exceeded maximum execution time: {}ms", submission.getId(), totalTime);
                                submission.setStatus(SubmissionEntity.SubmissionStatus.TIME_LIMIT_EXCEEDED);
                                submission.setCompileError("Maximum submission processing time exceeded");
                                submission.setPassedTests(0);
                                submission.setTotalTests(testCases.size());
                                submission.setScore(0.0);
                                submission = submissionRepository.save(submission);
                                return convertToResponse(submission);
                        }

                        log.info("Code execution completed for submission: {}, status: {}", 
                                submission.getId(), result.getStatus());

                        // Update submission with execution results
                        submission.setStatus(result.getStatus());
                        submission.setExecutionTime((int) result.getExecutionTime());
                        submission.setMemoryUsed((int) result.getMemoryUsed());
                        
                        // Set error messages based on status
                        if (result.getStatus() == SubmissionEntity.SubmissionStatus.COMPILE_ERROR) {
                                submission.setCompileError(result.getErrorMessage());
                        } else if (result.getStatus() == SubmissionEntity.SubmissionStatus.RUNTIME_ERROR ||
                                   result.getStatus() == SubmissionEntity.SubmissionStatus.SYSTEM_ERROR) {
                                submission.setRuntimeError(result.getErrorMessage());
                        }

                        // Handle test case results
                        List<TestCaseResult> testResults = result.getTestResults();
                        int passedTests = result.getPassedTests();
                        int totalTests = result.getTotalTests();

                        // Fallback calculation if results are inconsistent
                        if (testResults != null && !testResults.isEmpty()) {
                                passedTests = (int) testResults.stream()
                                        .mapToLong(tr -> tr.isPassed() ? 1 : 0)
                                        .sum();
                                totalTests = testResults.size();
                                
                                // Log test case results for debugging
                                log.debug("Test case results for submission {}: passed={}/{}", 
                                        submission.getId(), passedTests, totalTests);
                        }

                        // Update test counts and score
                        submission.setPassedTests(passedTests);
                        submission.setTotalTests(totalTests);
                        
                        // Calculate score (avoid division by zero)
                        double score = totalTests > 0 ? (double) passedTests / totalTests * 100.0 : 0.0;
                        submission.setScore(score);

                        // Set judge message for additional context
                        if (result.getStatus() == SubmissionEntity.SubmissionStatus.ACCEPTED) {
                                submission.setJudgeMessage("All test cases passed successfully");
                        } else if (result.getStatus() == SubmissionEntity.SubmissionStatus.WRONG_ANSWER) {
                                submission.setJudgeMessage(String.format("Passed %d out of %d test cases", passedTests, totalTests));
                        } else if (result.getErrorMessage() != null) {
                                submission.setJudgeMessage(result.getErrorMessage());
                        }

                        // Save final submission
                        submission = submissionRepository.save(submission);
                        
                        log.info("Submission {} processed successfully: status={}, score={}, passed={}/{}", 
                                submission.getId(), submission.getStatus(), submission.getScore(), 
                                submission.getPassedTests(), submission.getTotalTests());

                        return convertToResponse(submission);

                } catch (Exception e) {
                        log.error("Error during code execution for submission: {}", submission.getId(), e);

                        // Update submission with error status
                        submission.setStatus(SubmissionEntity.SubmissionStatus.SYSTEM_ERROR);
                        submission.setRuntimeError("System error during execution: " + e.getMessage());
                        submission.setJudgeMessage("Internal system error occurred during code execution");
                        submission.setPassedTests(0);
                        submission.setTotalTests(testCases.size());
                        submission.setScore(0.0);
                        submission = submissionRepository.save(submission);

                        return convertToResponse(submission);
                }
        }

        @Override
        public SubmissionResponse getSubmissionById(Long id) {
                SubmissionEntity submission = submissionRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Submission not found: " + id));
                return convertToResponse(submission);
        }

        @Override
        public PaginationWrapper<List<SubmissionResponse>> getSubmissionsByUser(Long userId, Pageable pageable) {
                Page<SubmissionEntity> submissions = submissionRepository.findByUser_IdOrderByCreatedDateDesc(userId,
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
        public PaginationWrapper<List<SubmissionResponse>> getSubmissionsByProblem(Long problemId, Pageable pageable) {
                Page<SubmissionEntity> submissions = submissionRepository.findByProblem_IdOrderByCreatedDateDesc(
                                problemId,
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