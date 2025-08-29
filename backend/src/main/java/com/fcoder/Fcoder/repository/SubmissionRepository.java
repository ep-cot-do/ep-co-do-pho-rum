package com.fcoder.Fcoder.repository;

import com.fcoder.Fcoder.model.entity.SubmissionEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionRepository extends BaseRepository<SubmissionEntity, Long> {

    Page<SubmissionEntity> findByUser_IdOrderByCreatedDateDesc(Long userId, Pageable pageable);

    Page<SubmissionEntity> findByProblem_IdOrderByCreatedDateDesc(Long problemId, Pageable pageable);

    Page<SubmissionEntity> findByUser_IdAndProblem_IdOrderByCreatedDateDesc(
            Long userId, Long problemId, Pageable pageable);

    List<SubmissionEntity> findByUser_IdAndProblem_IdAndStatusOrderByCreatedDateDesc(
            Long userId, Long problemId, SubmissionEntity.SubmissionStatus status);

    Optional<SubmissionEntity> findFirstByUser_IdAndProblem_IdAndStatusOrderByCreatedDateDesc(
            Long userId, Long problemId, SubmissionEntity.SubmissionStatus status);

    @Query("SELECT COUNT(s) FROM SubmissionEntity s WHERE s.user.id = :userId AND s.status = 'ACCEPTED'")
    Integer countAcceptedSubmissionsByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(DISTINCT s.problem.id) FROM SubmissionEntity s WHERE s.user.id = :userId AND s.status = 'ACCEPTED'")
    Integer countSolvedProblemsByUserId(@Param("userId") Long userId);

    @Query("SELECT s FROM SubmissionEntity s WHERE s.status IN ('PENDING', 'COMPILING', 'RUNNING') ORDER BY s.createdDate ASC")
    List<SubmissionEntity> findPendingSubmissions();

    boolean existsByUser_IdAndProblem_IdAndStatus(Long userId, Long problemId,
            SubmissionEntity.SubmissionStatus status);
    
    // Admin-specific methods
    long countByUser(com.fcoder.Fcoder.model.entity.AccountEntity user);
    long countByProblem(com.fcoder.Fcoder.model.entity.ProblemEntity problem);
    long countByProblemAndStatus(com.fcoder.Fcoder.model.entity.ProblemEntity problem, SubmissionEntity.SubmissionStatus status);
}
