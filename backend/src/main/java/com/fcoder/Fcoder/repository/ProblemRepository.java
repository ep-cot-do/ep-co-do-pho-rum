package com.fcoder.Fcoder.repository;

import com.fcoder.Fcoder.model.entity.ProblemEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProblemRepository extends BaseRepository<ProblemEntity, Long> {

    Page<ProblemEntity> findByIsActiveTrueOrderByCreatedDateDesc(Pageable pageable);

    Page<ProblemEntity> findByIsActiveTrueAndDifficultyOrderByCreatedDateDesc(
            ProblemEntity.ProblemDifficulty difficulty, Pageable pageable);

    Page<ProblemEntity> findByIsActiveTrueAndCategoryContainingIgnoreCaseOrderByCreatedDateDesc(
            String category, Pageable pageable);

    @Query("SELECT p FROM ProblemEntity p WHERE p.isActive = true AND " +
            "(LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<ProblemEntity> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT p FROM ProblemEntity p WHERE p.isActive = true AND p.tags LIKE %:tag%")
    Page<ProblemEntity> findByTag(@Param("tag") String tag, Pageable pageable);

    List<ProblemEntity> findByCreatedBy_IdAndIsActiveTrue(Long userId);

    @Query("SELECT COUNT(s) FROM SubmissionEntity s WHERE s.problem.id = :problemId")
    Integer countSubmissionsByProblemId(@Param("problemId") Long problemId);

    @Query("SELECT COUNT(s) FROM SubmissionEntity s WHERE s.problem.id = :problemId AND s.status = 'ACCEPTED'")
    Integer countAcceptedSubmissionsByProblemId(@Param("problemId") Long problemId);

    // Thêm vào ProblemRepository
    List<ProblemEntity> findByCreatedBy_IdOrderByCreatedDateDesc(Long userId);
    
    // Admin-specific methods
    long countByIsActive(Boolean isActive);

    @Query("SELECT p FROM ProblemEntity p WHERE " +
            "(:title IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
            "(:category IS NULL OR LOWER(p.category) LIKE LOWER(CONCAT('%', :category, '%'))) AND " +
            "(:difficulty IS NULL OR p.difficulty = :difficulty) AND " +
            "(:tag IS NULL OR p.tags LIKE CONCAT('%', :tag, '%')) AND " +
            "(:isActive IS NULL OR p.isActive = :isActive) AND " +
            "(:authorId IS NULL OR p.createdBy.id = :authorId)")
    List<ProblemEntity> findProblemsWithFilters(@Param("title") String title,
                                                @Param("category") String category,
                                                @Param("difficulty") ProblemEntity.ProblemDifficulty difficulty,
                                                @Param("tag") String tag,
                                                @Param("isActive") Boolean isActive,
                                                @Param("authorId") Long authorId);

}
