package com.fcoder.Fcoder.service;

import com.fcoder.Fcoder.model.dto.request.NotificationRequest;
import com.fcoder.Fcoder.model.dto.response.NotificationResponse;
import com.fcoder.Fcoder.model.dto.request.QueryWrapper;
import com.fcoder.Fcoder.model.dto.response.LibraryResponse;
import com.fcoder.Fcoder.model.dto.response.PaginationWrapper;

import java.util.List;

public interface NotificationService {
    PaginationWrapper<List<NotificationResponse>> getAllNotification(QueryWrapper queryWrapper);
    NotificationResponse getNotificationById(Long id);
    NotificationResponse createNotification(NotificationRequest notificationRequest);
    NotificationResponse updateNotification(Long id, NotificationRequest notificationRequest);
    void deleteNotification(Long id);
    void hideNotification(Long id);
    void showNotification(Long id);
    void isReadNotification(Long id);
    List<NotificationResponse>getMyNotification();
}
