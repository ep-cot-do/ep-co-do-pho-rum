package com.fcoder.Fcoder.repository;

import com.fcoder.Fcoder.model.entity.RoleEntity;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends BaseRepository<RoleEntity, Long> {
    Optional<RoleEntity> findByRoleName(String roleName);
}