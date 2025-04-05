package com.fcoder.Fcoder.repository;

import com.fcoder.Fcoder.model.entity.NotificationEntity;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends BaseRepository<NotificationEntity,Long>{
    Optional<NotificationEntity> findById( Long id);
}
