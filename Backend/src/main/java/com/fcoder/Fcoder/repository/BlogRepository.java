package com.fcoder.Fcoder.repository;

import com.fcoder.Fcoder.model.entity.AccountEntity;
import com.fcoder.Fcoder.model.entity.BlogEntity;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlogRepository extends BaseRepository<BlogEntity, Long> {
    Optional<BlogEntity> findByCategory(String category);
    Optional<BlogEntity> findByStatus(String status);
    Optional<BlogEntity> findByAuthorId(AccountEntity authorId);

    @Query("SELECT b FROM BlogEntity b WHERE " +
            "(:title IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
            "(:category IS NULL OR b.category = :category) AND " +
            "(:status IS NULL OR b.status = :status) AND " +
            "(:minViews IS NULL OR b.view >= :minViews) AND " +
            "(:maxViews IS NULL OR b.view <= :maxViews) AND " +
            "(:authorId IS NULL OR b.authorId.id = :authorId)")
    List<BlogEntity> filterBlogs(
            @Param("title") String title,
            @Param("category") String category,
            @Param("status") String status,
            @Param("minViews") Integer minViews,
            @Param("maxViews") Integer maxViews,
            @Param("authorId") Long authorId
    );
}
