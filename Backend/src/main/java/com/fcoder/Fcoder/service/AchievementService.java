package com.fcoder.Fcoder.service;

import com.fcoder.Fcoder.model.dto.request.AchievementRequest;
import com.fcoder.Fcoder.model.dto.request.QueryWrapper;
import com.fcoder.Fcoder.model.dto.response.AchievementResponse;
import com.fcoder.Fcoder.model.dto.response.PaginationWrapper;

import java.util.List;

public interface AchievementService {
    PaginationWrapper<List<AchievementResponse>> getAllAchievements(QueryWrapper queryWrapper);

    AchievementResponse getAchievementById(Long id);

    AchievementResponse createAchievement(AchievementRequest achievementRequest);

    AchievementResponse updateAchievement(Long id, AchievementRequest achievementRequest);

    void deleteAchievement(Long id);

    AchievementResponse patchAchievement(Long id, AchievementRequest achievementRequest);

    List<AchievementResponse> getAchievementsByUserId(Long userId);

    List<AchievementResponse>getAchievementByUserId(Long userId);
    List<AchievementResponse> getMyAchievement();
}
