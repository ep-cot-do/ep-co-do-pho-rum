package com.fcoder.Fcoder.service.impl;

import com.fcoder.Fcoder.model.dto.request.ProblemRequest;
import com.fcoder.Fcoder.model.dto.request.TestCaseRequest;
import com.fcoder.Fcoder.model.dto.response.PaginationWrapper;
import com.fcoder.Fcoder.model.dto.response.ProblemResponse;
import com.fcoder.Fcoder.model.dto.response.TestCaseResponse;
import com.fcoder.Fcoder.model.entity.AccountEntity;
import com.fcoder.Fcoder.model.entity.ProblemEntity;
import com.fcoder.Fcoder.model.entity.TestCaseEntity;
import com.fcoder.Fcoder.repository.AccountRepository;
import com.fcoder.Fcoder.repository.ProblemRepository;
import com.fcoder.Fcoder.repository.TestCaseRepository;
import com.fcoder.Fcoder.service.ProblemService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProblemServiceImpl implements ProblemService {

    private final ProblemRepository problemRepository;
    private final TestCaseRepository testCaseRepository;
    private final AccountRepository accountRepository;

    @Override
    @Transactional
    public ProblemResponse createProblem(ProblemRequest request, String createdBy) {
        AccountEntity creator = accountRepository.findByEmail(createdBy)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ProblemEntity problem = new ProblemEntity();
        problem.setTitle(request.getTitle());
        problem.setDescription(request.getDescription());
        problem.setInputFormat(request.getInputFormat());
        problem.setOutputFormat(request.getOutputFormat());
        problem.setConstraints(request.getConstraints());
        problem.setTimeLimit(request.getTimeLimit());
        problem.setMemoryLimit(request.getMemoryLimit());
        problem.setDifficulty(request.getDifficulty());
        problem.setCategory(request.getCategory());
        problem.setTags(request.getTags() != null ? String.join(",", request.getTags()) : null);
        problem.setIsActive(request.getIsActive());
        problem.setCreatedBy(creator);

        ProblemEntity savedProblem = problemRepository.save(problem);

        // Save test cases
        if (request.getTestCases() != null && !request.getTestCases().isEmpty()) {
            List<TestCaseEntity> testCases = request.getTestCases().stream()
                    .map(testCaseRequest -> createTestCaseEntity(testCaseRequest, savedProblem))
                    .collect(Collectors.toList());
            testCaseRepository.saveAll(testCases);
        }

        return convertToResponse(savedProblem);
    }

    @Override
    @Transactional
    public ProblemResponse updateProblem(Long id, ProblemRequest request) {
        ProblemEntity problem = problemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Problem not found"));

        problem.setTitle(request.getTitle());
        problem.setDescription(request.getDescription());
        problem.setInputFormat(request.getInputFormat());
        problem.setOutputFormat(request.getOutputFormat());
        problem.setConstraints(request.getConstraints());
        problem.setTimeLimit(request.getTimeLimit());
        problem.setMemoryLimit(request.getMemoryLimit());
        problem.setDifficulty(request.getDifficulty());
        problem.setCategory(request.getCategory());
        problem.setTags(request.getTags() != null ? String.join(",", request.getTags()) : null);
        problem.setIsActive(request.getIsActive());
        problem.setUpdatedDate(LocalDateTime.now());

        ProblemEntity savedProblem = problemRepository.save(problem);

        // Update test cases
        if (request.getTestCases() != null) {
            testCaseRepository.deleteByProblem_Id(id);
            List<TestCaseEntity> testCases = request.getTestCases().stream()
                    .map(testCaseRequest -> createTestCaseEntity(testCaseRequest, savedProblem))
                    .collect(Collectors.toList());
            testCaseRepository.saveAll(testCases);
        }

        return convertToResponse(savedProblem);
    }

    @Override
    public ProblemResponse getProblemById(Long id) {
        ProblemEntity problem = problemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Problem not found"));
        return convertToResponse(problem);
    }

    @Override
    public PaginationWrapper<List<ProblemResponse>> getAllProblems(Pageable pageable) {
        Page<ProblemEntity> problemPage = problemRepository.findByIsActiveTrueOrderByCreatedDateDesc(pageable);
        List<ProblemResponse> problems = problemPage.getContent().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return new PaginationWrapper<>(
                problems,
                problemPage.getNumber(),
                problemPage.getSize(),
                problemPage.getTotalPages(),
                (int) problemPage.getTotalElements());
    }

    @Override
    public PaginationWrapper<List<ProblemResponse>> getProblemsByDifficulty(
            ProblemEntity.ProblemDifficulty difficulty, Pageable pageable) {
        Page<ProblemEntity> problemPage = problemRepository
                .findByIsActiveTrueAndDifficultyOrderByCreatedDateDesc(difficulty, pageable);
        List<ProblemResponse> problems = problemPage.getContent().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return new PaginationWrapper<>(
                problems,
                problemPage.getNumber(),
                problemPage.getSize(),
                problemPage.getTotalPages(),
                (int) problemPage.getTotalElements());
    }

    @Override
    public PaginationWrapper<List<ProblemResponse>> getProblemsByCategory(String category, Pageable pageable) {
        Page<ProblemEntity> problemPage = problemRepository
                .findByIsActiveTrueAndCategoryContainingIgnoreCaseOrderByCreatedDateDesc(category, pageable);
        List<ProblemResponse> problems = problemPage.getContent().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return new PaginationWrapper<>(
                problems,
                problemPage.getNumber(),
                problemPage.getSize(),
                problemPage.getTotalPages(),
                (int) problemPage.getTotalElements());
    }

    @Override
    public PaginationWrapper<List<ProblemResponse>> searchProblems(String keyword, Pageable pageable) {
        Page<ProblemEntity> problemPage = problemRepository.searchByKeyword(keyword, pageable);
        List<ProblemResponse> problems = problemPage.getContent().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return new PaginationWrapper<>(
                problems,
                problemPage.getNumber(),
                problemPage.getSize(),
                problemPage.getTotalPages(),
                (int) problemPage.getTotalElements());
    }

    @Override
    public PaginationWrapper<List<ProblemResponse>> getProblemsByTag(String tag, Pageable pageable) {
        Page<ProblemEntity> problemPage = problemRepository.findByTag(tag, pageable);
        List<ProblemResponse> problems = problemPage.getContent().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return new PaginationWrapper<>(
                problems,
                problemPage.getNumber(),
                problemPage.getSize(),
                problemPage.getTotalPages(),
                (int) problemPage.getTotalElements());
    }

    @Override
    public List<ProblemResponse> getProblemsByCreator(Long userId) {
        List<ProblemEntity> problems = problemRepository.findByCreatedBy_IdAndIsActiveTrue(userId);
        return problems.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteProblem(Long id) {
        if (!problemRepository.existsById(id)) {
            throw new RuntimeException("Problem not found");
        }
        problemRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void toggleProblemStatus(Long id) {
        ProblemEntity problem = problemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Problem not found"));
        problem.setIsActive(!problem.getIsActive());
        problem.setUpdatedDate(LocalDateTime.now());
        problemRepository.save(problem);
    }

    private TestCaseEntity createTestCaseEntity(TestCaseRequest request, ProblemEntity problem) {
        TestCaseEntity testCase = new TestCaseEntity();
        testCase.setProblem(problem);
        testCase.setInput(request.getInput());
        testCase.setExpectedOutput(request.getExpectedOutput());
        testCase.setIsSample(request.getIsSample());
        testCase.setIsActive(request.getIsActive());
        testCase.setTestOrder(request.getTestOrder());
        testCase.setPoints(request.getPoints());
        return testCase;
    }

    private ProblemResponse convertToResponse(ProblemEntity problem) {
        ProblemResponse response = new ProblemResponse();
        response.setId(problem.getId());
        response.setTitle(problem.getTitle());
        response.setDescription(problem.getDescription());
        response.setInputFormat(problem.getInputFormat());
        response.setOutputFormat(problem.getOutputFormat());
        response.setConstraints(problem.getConstraints());
        response.setTimeLimit(problem.getTimeLimit());
        response.setMemoryLimit(problem.getMemoryLimit());
        response.setDifficulty(problem.getDifficulty());
        response.setCategory(problem.getCategory());
        response.setIsActive(problem.getIsActive());
        response.setCreatedDate(problem.getCreatedDate());

        if (problem.getTags() != null) {
            response.setTags(List.of(problem.getTags().split(",")));
        }

        if (problem.getCreatedBy() != null) {
            response.setCreatedBy(problem.getCreatedBy().getEmail());
        }

        // Get sample test cases
        List<TestCaseEntity> sampleTestCases = testCaseRepository
                .findByProblem_IdAndIsSampleTrueAndIsActiveTrueOrderByTestOrder(problem.getId());
        response.setSampleTestCases(sampleTestCases.stream()
                .map(this::convertTestCaseToResponse)
                .collect(Collectors.toList()));

        // Get statistics
        Integer totalSubmissions = problemRepository.countSubmissionsByProblemId(problem.getId());
        Integer acceptedSubmissions = problemRepository.countAcceptedSubmissionsByProblemId(problem.getId());
        response.setTotalSubmissions(totalSubmissions);
        response.setAcceptedSubmissions(acceptedSubmissions);
        response.setAcceptanceRate(totalSubmissions > 0 ? (double) acceptedSubmissions / totalSubmissions * 100 : 0.0);

        return response;
    }

    private TestCaseResponse convertTestCaseToResponse(TestCaseEntity testCase) {
        TestCaseResponse response = new TestCaseResponse();
        response.setId(testCase.getId());
        response.setInput(testCase.getInput());
        response.setExpectedOutput(testCase.getExpectedOutput());
        response.setIsSample(testCase.getIsSample());
        response.setTestOrder(testCase.getTestOrder());
        response.setPoints(testCase.getPoints());
        return response;
    }
}
