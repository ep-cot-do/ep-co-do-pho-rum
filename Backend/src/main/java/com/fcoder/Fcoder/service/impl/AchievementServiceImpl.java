package com.fcoder.Fcoder.service.impl;

import com.fcoder.Fcoder.model.dto.request.AchievementRequest;
import com.fcoder.Fcoder.model.dto.request.QueryWrapper;
import com.fcoder.Fcoder.model.dto.response.AchievementResponse;
import com.fcoder.Fcoder.model.dto.response.PaginationWrapper;
import com.fcoder.Fcoder.model.entity.AchievementEntity;
import com.fcoder.Fcoder.model.entity.AccountEntity;
import com.fcoder.Fcoder.model.exception.ActionFailedException;
import com.fcoder.Fcoder.model.exception.ValidationException;
import com.fcoder.Fcoder.repository.AccountRepository;
import com.fcoder.Fcoder.repository.AchievementRepository;
import com.fcoder.Fcoder.service.AchievementService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AchievementServiceImpl implements AchievementService {
    private final AccountRepository accountRepository;
    private final AchievementRepository achievementRepository;

    @Override
    public PaginationWrapper<List<AchievementResponse>> getAllAchievements(QueryWrapper queryWrapper) {
        return achievementRepository.query(queryWrapper,
                achievementRepository::queryAnySpecification,
                (items) -> {
                    var list = items.map(this::wrapAchievementResponse).stream().toList();
                    return new PaginationWrapper.Builder<List<AchievementResponse>>()
                            .setPaginationInfo(items)
                            .setData(list)
                            .build();
                });
    }

    @Override
    public AchievementResponse getAchievementById(Long id) {
        var achievement = achievementRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Achievement not fou nd"));
        return wrapAchievementResponse(achievement);
    }

    @Transactional
    @Override
    public AchievementResponse createAchievement(AchievementRequest achievementRequest) {
        AccountEntity user = accountRepository.findById(achievementRequest.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        var achievement = AchievementEntity.builder()
                .userId(user)
                .title(achievementRequest.getTitle())
                .description(achievementRequest.getDescription())
                .image(achievementRequest.getImage())
                .category(achievementRequest.getCategory())
                .isActive(achievementRequest.getIsActive())
                .build();

        return wrapAchievementResponse(achievementRepository.save(achievement));
    }

    @Transactional
    @Override
    public AchievementResponse updateAchievement(Long id, AchievementRequest achievementRequest) {
        var achievement = achievementRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Achievement not found"));

        achievement.setTitle(achievementRequest.getTitle());
        achievement.setDescription(achievementRequest.getDescription());
        achievement.setImage(achievementRequest.getImage());
        achievement.setCategory(achievementRequest.getCategory());
        achievement.setIsActive(achievementRequest.getIsActive());

        return wrapAchievementResponse(achievementRepository.save(achievement));
    }

    @Transactional
    @Override
    public void deleteAchievement(Long id) {
        if (!achievementRepository.existsById(id)) {
            throw new ValidationException("Achievement not found");
        }
        try {
            achievementRepository.deleteById(id);
        } catch (Exception ex) {
            throw new ActionFailedException("Failed to delete achievement", ex);
        }
    }

    @Override
    public List<AchievementResponse> getAchievementsByUserId(Long userId) {
        var account = accountRepository.findById(userId)
                .orElseThrow(() -> new ValidationException("User not found"));

        return achievementRepository.findByUserId(account.getId()).stream()
                .map(this::wrapAchievementResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public AchievementResponse patchAchievement(Long id, AchievementRequest achievementRequest) {
        var achievement = achievementRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Achievement not found"));

        if (achievementRequest.getTitle() != null) {
            achievement.setTitle(achievementRequest.getTitle());
        }
        if (achievementRequest.getDescription() != null) {
            achievement.setDescription(achievementRequest.getDescription());
        }
        if (achievementRequest.getImage() != null) {
            achievement.setImage(achievementRequest.getImage());
        }
        if (achievementRequest.getCategory() != null) {
            achievement.setCategory(achievementRequest.getCategory());
        }
        if (achievementRequest.getIsActive() != null) {
            achievement.setIsActive(achievementRequest.getIsActive());
        }

        return wrapAchievementResponse(achievementRepository.save(achievement));
    }


    private AchievementResponse wrapAchievementResponse(AchievementEntity achievement) {
        return AchievementResponse.builder()
                .id(achievement.getId())
                .userId(achievement.getUserId().getId())
                .title(achievement.getTitle())
                .description(achievement.getDescription())
                .image(achievement.getImage())
                .category(achievement.getCategory())
                .isActive(achievement.getIsActive())
                .createdDate(achievement.getCreatedDate().toString())
                .updatedDate(achievement.getUpdatedDate().toString())
                .build();
    }
}
