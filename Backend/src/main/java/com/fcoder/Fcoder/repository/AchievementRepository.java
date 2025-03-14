package com.fcoder.Fcoder.repository;

import com.fcoder.Fcoder.model.entity.AchievementEntity;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AchievementRepository extends BaseRepository<AchievementEntity, Long> {

    @Query(value = "SELECT * FROM achievement WHERE userId = :userId", nativeQuery = true)
    List<AchievementEntity> findByUserId(@Param("userId") Long userId);
}
