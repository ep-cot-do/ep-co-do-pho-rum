package com.fcoder.Fcoder.repository;

import com.fcoder.Fcoder.model.entity.EventRegistrationEntity;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EventRegistrationRepository extends BaseRepository<EventRegistrationEntity, Long> {
    Optional<EventRegistrationEntity> findById(Long id);
}
