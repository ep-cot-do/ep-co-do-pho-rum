package com.fcoder.Fcoder.repository;

import com.fcoder.Fcoder.model.entity.FaqEntity;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface FaqRepository extends BaseRepository<FaqEntity, Long> {
    Optional<FaqEntity> findById(Long id);
}