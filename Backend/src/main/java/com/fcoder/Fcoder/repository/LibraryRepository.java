package com.fcoder.Fcoder.repository;

import com.fcoder.Fcoder.model.entity.LibraryEntity;
import com.fcoder.Fcoder.model.entity.AccountEntity;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LibraryRepository extends BaseRepository<LibraryEntity, Long> {
    Optional<LibraryEntity> findById(Long id);

    @Query("SELECT l FROM LibraryEntity l WHERE " +
            "(:semester IS NULL OR l.semester = :semester) AND " +
            "(:major IS NULL OR l.major = :major) AND " +
            "(:subjectCode IS NULL OR l.subjectCode = :subjectCode) AND " +
            "(:type IS NULL OR l.type = :type) AND " +
            "(:status IS NULL OR l.status = :status) AND " +
            "(:authorId IS NULL OR l.authorId.id = :authorId)")
    List<LibraryEntity> filterLibrary(
            @Param("semester") Integer semester,
            @Param("major") String major,
            @Param("subjectCode") String subjectCode,
            @Param("type") String type,
            @Param("status") String status,
            @Param("authorId") Long authorId
    );
}
