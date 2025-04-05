package com.fcoder.Fcoder.repository;

import com.fcoder.Fcoder.model.entity.GameEntity;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GameRepository extends BaseRepository<GameEntity,Long>{
    Optional<GameEntity> findById(Long id);
    Optional<GameEntity> findByCategory(String category);
    List<GameEntity> findByAuthorId_Id(Long authorId);
    List<GameEntity> findByTitleContainingIgnoreCase(String title);
}
