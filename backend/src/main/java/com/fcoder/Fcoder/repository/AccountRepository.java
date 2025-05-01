package com.fcoder.Fcoder.repository;

import com.fcoder.Fcoder.model.entity.AccountEntity;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends BaseRepository<AccountEntity, Long> {
    Optional<AccountEntity> findByStudentCode(String studentCode);
    Optional<AccountEntity> findByUsername(String username);
    Optional<AccountEntity> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
}
