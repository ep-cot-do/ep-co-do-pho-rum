package com.fcoder.Fcoder.repository;

import com.fcoder.Fcoder.model.entity.TestCaseEntity;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestCaseRepository extends BaseRepository<TestCaseEntity, Long> {

    List<TestCaseEntity> findByProblem_IdAndIsActiveTrueOrderByTestOrder(Long problemId);

    List<TestCaseEntity> findByProblem_IdAndIsSampleTrueAndIsActiveTrueOrderByTestOrder(Long problemId);

    List<TestCaseEntity> findByProblem_IdAndIsSampleFalseAndIsActiveTrueOrderByTestOrder(Long problemId);

    void deleteByProblem_Id(Long problemId);
}
