package com.fcoder.Fcoder.service.impl;

import com.fcoder.Fcoder.model.dto.request.NotificationRequest;
import com.fcoder.Fcoder.model.dto.request.QueryWrapper;
import com.fcoder.Fcoder.model.dto.response.NotificationResponse;
import com.fcoder.Fcoder.model.dto.response.PaginationWrapper;
import com.fcoder.Fcoder.model.entity.AccountEntity;
import com.fcoder.Fcoder.model.entity.NotificationEntity;
import com.fcoder.Fcoder.model.exception.ValidationException;
import com.fcoder.Fcoder.repository.AccountRepository;
import com.fcoder.Fcoder.repository.NotificationRepository;
import com.fcoder.Fcoder.service.NotificationService;
import com.fcoder.Fcoder.util.AuthUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository notificationRepository;
    private final AccountRepository accountRepository;
    private final AuthUtils authUtils;

    @Override
    public PaginationWrapper<List<NotificationResponse>> getAllNotification(QueryWrapper queryWrapper) {
        return notificationRepository.query(queryWrapper,
                notificationRepository::queryAnySpecification,
                (items) -> {
                    var list = items.map(this::mapToResponse).stream().toList();
                    return new PaginationWrapper.Builder<List<NotificationResponse>>()
                            .setPaginationInfo(items)
                            .setData(list)
                            .build();
                });
    }

    @Override
    public NotificationResponse getNotificationById(Long id) {
        var notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Notification not found"));
        return mapToResponse(notification);
    }

    @Transactional
    @Override
    public NotificationResponse createNotification(NotificationRequest notificationRequest) {
        AccountEntity account = accountRepository.findById(notificationRequest.getAccountId())
                .orElseThrow(() -> new ValidationException("Account not found"));

        var notification = NotificationEntity.builder()
                .accountId(account)
                .title(notificationRequest.getTitle())
                .content(notificationRequest.getContent())
                .isRead(false)
                .isActive(true)
                .build();

        return mapToResponse(notificationRepository.save(notification));
    }

    @Transactional
    @Override
    public NotificationResponse updateNotification(Long id, NotificationRequest notificationRequest) {
        var notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Notification not found"));

        notification.setTitle(notificationRequest.getTitle());
        notification.setContent(notificationRequest.getContent());
        notification.setUpdatedDate(LocalDateTime.now());

        return mapToResponse(notificationRepository.save(notification));
    }

    @Transactional
    @Override
    public void deleteNotification(Long id) {
        if (!notificationRepository.existsById(id)) {
            throw new ValidationException("Notification not found");
        }
        notificationRepository.deleteById(id);
    }

    @Transactional
    @Override
    public void hideNotification(Long id) {
        var notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Notification not found"));
        notification.setActive(false);
        notificationRepository.save(notification);
    }

    @Transactional
    @Override
    public void showNotification(Long id) {
        var notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Notification not found"));
        notification.setActive(true);
        notificationRepository.save(notification);
    }

    @Transactional
    @Override
    public void isReadNotification(Long id) {
        var notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Override
    public List<NotificationResponse> getMyNotification() {
        AccountEntity currentUser = authUtils.getUserFromAuthentication();

        List<NotificationEntity> userNotifications = notificationRepository.findAll()
                .stream()
                .filter(notification -> notification.getAccountId() != null &&
                        notification.getAccountId().getId().equals(currentUser.getId()))
                .toList();

        if (userNotifications.isEmpty()) {
            throw new ValidationException("No notifications found for current user");
        }

        return userNotifications.stream()
                .map(this::mapToResponse)
                .toList();
    }

    private NotificationResponse mapToResponse(NotificationEntity notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .accountId(notification.getAccountId().getId())
                .title(notification.getTitle())
                .content(notification.getContent())
                .isRead(notification.isRead())
                .isActive(notification.isActive())
                .createdDate(notification.getCreatedDate())
                .updatedDate(notification.getUpdatedDate())
                .build();
    }
}
