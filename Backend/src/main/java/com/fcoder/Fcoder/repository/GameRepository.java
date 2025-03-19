package com.fcoder.Fcoder.repository;

import com.fcoder.Fcoder.model.entity.GameEntity;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface GameRepository extends BaseRepository<GameEntity,Long>{
    Optional<GameEntity> findById(Long id);
    Optional<GameEntity> findByCategory(String category);
}
