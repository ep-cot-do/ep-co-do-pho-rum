package com.fcoder.Fcoder.repository;


import com.fcoder.Fcoder.model.entity.CommentEntity;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends BaseRepository<CommentEntity, Long> {
    Optional<CommentEntity> findById(Long id);
}
