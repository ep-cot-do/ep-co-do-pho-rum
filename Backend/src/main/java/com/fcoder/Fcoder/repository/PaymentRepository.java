package com.fcoder.Fcoder.repository;

import com.fcoder.Fcoder.model.entity.PaymentEntity;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PaymentRepository extends BaseRepository<PaymentEntity, Long> {
    Optional<PaymentEntity> findById(Long id);

    PaymentEntity findFirstByOrderByCreatedDateDesc();
}