package com.fcoder.Fcoder.repository;

import com.fcoder.Fcoder.model.entity.EventRecapEntity;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EventRecapRepository extends BaseRepository<EventRecapEntity,Long>{
    Optional<EventRecapEntity> findById(Long id);
}
