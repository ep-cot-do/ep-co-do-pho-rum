package com.fcoder.Fcoder.repository;

import com.fcoder.Fcoder.model.entity.EventEntity;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EventRepository extends BaseRepository<EventEntity, Long> {
    Optional<EventEntity> findById(Long id);
}
