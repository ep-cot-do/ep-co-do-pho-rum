package com.fcoder.Fcoder.service.impl;

import com.fcoder.Fcoder.model.dto.request.QueryWrapper;
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
import com.fcoder.Fcoder.util.AuthUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import jakarta.persistence.criteria.Predicate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProblemServiceImpl implements ProblemService {

    private final ProblemRepository problemRepository;
    private final TestCaseRepository testCaseRepository;
    private final AccountRepository accountRepository;
    private final AuthUtils authUtils;

    @Override
    @Transactional
    public ProblemResponse createProblem(ProblemRequest request) {
        AccountEntity creator = getCurrentUser();

        ProblemEntity problem = new ProblemEntity();
        mappingEntity(request, problem);
        problem.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);
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

    public void mappingEntity(ProblemRequest request, ProblemEntity problem) {
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
    }

    @Override
    @Transactional
    public ProblemResponse updateProblem(Long id, ProblemRequest request) {
        ProblemEntity problem = problemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Problem not found"));

        mappingEntity(request, problem);
        if (request.getIsActive() != null) {
            problem.setIsActive(request.getIsActive());
        }
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
    public PaginationWrapper<List<ProblemResponse>> getAllProblems(QueryWrapper queryWrapper) {
        Specification<ProblemEntity> spec = Specification.where(null);

        // Add search filters from QueryWrapper
        Map<String, String> searchParams = queryWrapper.search();

        if (searchParams != null && !searchParams.isEmpty()) {
            // General search across multiple fields
            if (searchParams.containsKey("q") || searchParams.containsKey("search")) {
                String searchTerm = searchParams.getOrDefault("q", searchParams.get("search"));
                if (StringUtils.hasText(searchTerm)) {
                    spec = spec.and((root, query, criteriaBuilder) -> {
                        String term = "%" + searchTerm.toLowerCase() + "%";
                        return criteriaBuilder.or(
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), term),
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), term),
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("category")), term)
                        );
                    });
                }
            }

            // Specific field searches
            if (searchParams.containsKey("title")) {
                String title = searchParams.get("title");
                if (StringUtils.hasText(title)) {
                    spec = spec.and((root, query, criteriaBuilder) ->
                            criteriaBuilder.like(criteriaBuilder.lower(root.get("title")),
                                    "%" + title.toLowerCase() + "%"));
                }
            }

            if (searchParams.containsKey("category")) {
                String category = searchParams.get("category");
                if (StringUtils.hasText(category)) {
                    spec = spec.and((root, query, criteriaBuilder) ->
                            criteriaBuilder.like(criteriaBuilder.lower(root.get("category")),
                                    "%" + category.toLowerCase() + "%"));
                }
            }
        }

        // Add active filter
        spec = spec.and((root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("isActive"), true));

        Pageable pageable = queryWrapper.pagination();
        Page<ProblemEntity> problemPage = problemRepository.findAll(spec, pageable);

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
            ProblemEntity.ProblemDifficulty difficulty, QueryWrapper queryWrapper) {
        Specification<ProblemEntity> spec = (root, query, criteriaBuilder) -> {
            return criteriaBuilder.and(
                    criteriaBuilder.equal(root.get("isActive"), true),
                    criteriaBuilder.equal(root.get("difficulty"), difficulty)
            );
        };

        Pageable pageable = queryWrapper.pagination();
        Page<ProblemEntity> problemPage = problemRepository.findAll(spec, pageable);

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
    public PaginationWrapper<List<ProblemResponse>> getProblemsByCategory(String category, QueryWrapper queryWrapper) {
        Specification<ProblemEntity> spec = (root, query, criteriaBuilder) -> {
            return criteriaBuilder.and(
                    criteriaBuilder.equal(root.get("isActive"), true),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("category")),
                            "%" + category.toLowerCase() + "%")
            );
        };

        Pageable pageable = queryWrapper.pagination();
        Page<ProblemEntity> problemPage = problemRepository.findAll(spec, pageable);

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
    public PaginationWrapper<List<ProblemResponse>> getProblemsByTag(String tag, QueryWrapper queryWrapper) {
        Specification<ProblemEntity> spec = (root, query, criteriaBuilder) -> {
            return criteriaBuilder.and(
                    criteriaBuilder.equal(root.get("isActive"), true),
                    criteriaBuilder.like(root.get("tags"), "%" + tag + "%")
            );
        };

        Pageable pageable = queryWrapper.pagination();
        Page<ProblemEntity> problemPage = problemRepository.findAll(spec, pageable);

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
    public List<ProblemResponse> filterProblems(String title, String category,
                                                ProblemEntity.ProblemDifficulty difficulty,
                                                String tag, String status, Long authorId) {
        Specification<ProblemEntity> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(title)) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("title")),
                        "%" + title.toLowerCase() + "%"
                ));
            }

            if (StringUtils.hasText(category)) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("category")),
                        "%" + category.toLowerCase() + "%"
                ));
            }

            if (difficulty != null) {
                predicates.add(criteriaBuilder.equal(root.get("difficulty"), difficulty));
            }

            if (StringUtils.hasText(tag)) {
                predicates.add(criteriaBuilder.like(root.get("tags"), "%" + tag + "%"));
            }

            if (StringUtils.hasText(status)) {
                boolean isActive = "active".equalsIgnoreCase(status);
                predicates.add(criteriaBuilder.equal(root.get("isActive"), isActive));
            }

            if (authorId != null) {
                predicates.add(criteriaBuilder.equal(root.get("createdBy").get("id"), authorId));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        List<ProblemEntity> problems = problemRepository.findAll(spec);
        return problems.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProblemResponse> getMyProblems() {
        AccountEntity currentUser = getCurrentUser();
        List<ProblemEntity> problems = problemRepository.findByCreatedBy_IdOrderByCreatedDateDesc(currentUser.getId());
        return problems.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void activateProblem(Long id) {
        ProblemEntity problem = problemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Problem not found"));
        problem.setIsActive(true);
        problem.setUpdatedDate(LocalDateTime.now());
        problemRepository.save(problem);
    }

    @Override
    @Transactional
    public void deactivateProblem(Long id) {
        ProblemEntity problem = problemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Problem not found"));
        problem.setIsActive(false);
        problem.setUpdatedDate(LocalDateTime.now());
        problemRepository.save(problem);
    }

    @Override
    @Transactional
    public void deleteProblem(Long id) {
        if (!problemRepository.existsById(id)) {
            throw new RuntimeException("Problem not found");
        }
        problemRepository.deleteById(id);
    }

    private AccountEntity getCurrentUser() {
        return authUtils.getUserFromAuthentication();
    }

    private TestCaseEntity createTestCaseEntity(TestCaseRequest request, ProblemEntity problem) {
        TestCaseEntity testCase = new TestCaseEntity();
        testCase.setProblem(problem);
        testCase.setInput(request.getInput());
        testCase.setExpectedOutput(request.getExpectedOutput());
        testCase.setIsSample(request.getIsSample() != null ? request.getIsSample() : false);
        testCase.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);
        testCase.setTestOrder(request.getTestOrder() != null ? request.getTestOrder() : 1);
        testCase.setPoints(request.getPoints() != null ? request.getPoints() : 0);
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
        response.setUpdatedDate(problem.getUpdatedDate());

        if (problem.getTags() != null && !problem.getTags().trim().isEmpty()) {
            response.setTags(Arrays.asList(problem.getTags().split(",")));
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

        // Get statistics (assuming these methods exist in repository)
        try {
            Integer totalSubmissions = problemRepository.countSubmissionsByProblemId(problem.getId());
            Integer acceptedSubmissions = problemRepository.countAcceptedSubmissionsByProblemId(problem.getId());
            response.setTotalSubmissions(totalSubmissions != null ? totalSubmissions : 0);
            response.setAcceptedSubmissions(acceptedSubmissions != null ? acceptedSubmissions : 0);
            response.setAcceptanceRate(totalSubmissions != null && totalSubmissions > 0 ?
                    (double) acceptedSubmissions / totalSubmissions * 100 : 0.0);
        } catch (Exception e) {
            // If statistics methods don't exist, set default values
            response.setTotalSubmissions(0);
            response.setAcceptedSubmissions(0);
            response.setAcceptanceRate(0.0);
        }

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