package com.fcoder.Fcoder.controller;

import com.fcoder.Fcoder.model.dto.request.NotificationRequest;
import com.fcoder.Fcoder.model.dto.request.QueryWrapper;
import com.fcoder.Fcoder.model.dto.response.NotificationResponse;
import com.fcoder.Fcoder.model.dto.response.ResponseObject;
import com.fcoder.Fcoder.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Pageable;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/notifications", produces = MediaType.APPLICATION_JSON_VALUE)
public class NotificationController {
    private final NotificationService notificationService;

    @GetMapping
    @Operation(summary = "Get all notifications", description = "This API returns all notifications")
    public ResponseEntity<ResponseObject<List<NotificationResponse>>> getAllNotifications(@RequestParam(name = "q", required = false) String query,
                                                                                          @PageableDefault(page = 0, size = 10) Pageable pageable) {
        var result = notificationService.getAllNotification(QueryWrapper.builder()
                .wrapSort(pageable)
                .search(query)
                .build());
        return ResponseEntity.ok(new ResponseObject.Builder<List<NotificationResponse>>()
                .success(true)
                .code("SUCCESS")
                .unwrapPaginationWrapper(result)
                .message("Notifications retrieved successfully")
                .build());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get notification by ID")
    public ResponseEntity<ResponseObject<NotificationResponse>> getNotificationById(@PathVariable Long id) {
        var notification = notificationService.getNotificationById(id);
        return ResponseEntity.ok(new ResponseObject.Builder<NotificationResponse>()
                .success(true)
                .code("SUCCESS")
                .content(notification)
                .message("Get Success")
                .build());
    }

    @PostMapping
    @Operation(summary = "Create a new notification", security = {@SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<NotificationResponse>> createNotification(@RequestBody NotificationRequest notificationRequest) {
        var notification = notificationService.createNotification(notificationRequest);
        return ResponseEntity.ok(new ResponseObject.Builder<NotificationResponse>()
                .success(true)
                .code("SUCCESS")
                .content(notification)
                .message("Create Success")
                .build());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a notification by ID", security = {@SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<NotificationResponse>> updateNotification(@PathVariable Long id, @RequestBody NotificationRequest notificationRequest) {
        var notification = notificationService.updateNotification(id, notificationRequest);
        return ResponseEntity.ok(new ResponseObject.Builder<NotificationResponse>()
                .success(true)
                .code("SUCCESS")
                .content(notification)
                .message("Update Success")
                .build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Operation(summary = "Delete a notification by ID", security = {@SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<Void>> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Delete Success")
                .build());
    }

    @PatchMapping("/hide/{id}")
    @Operation(summary = "Hide a notification by ID", security = {@SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<Void>> hideNotification(@PathVariable Long id) {
        notificationService.hideNotification(id);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Hide Success")
                .build());
    }

    @PatchMapping("/show/{id}")
    @Operation(summary = "Show a notification by ID", security = {@SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<Void>> showNotification(@PathVariable Long id) {
        notificationService.showNotification(id);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Show Success")
                .build());
    }

    @PatchMapping("/read/{id}")
    @Operation(summary = "Mark a notification as read", security = {@SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<Void>> isReadNotification(@PathVariable Long id) {
        notificationService.isReadNotification(id);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Marked as Read")
                .build());
    }
    @PatchMapping("/{id}")
    @Operation(summary = "Update a notification by ID", security = {@SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<NotificationResponse>> updateNotificationDetails(@PathVariable Long id,
                                                                                    @RequestBody NotificationRequest notificationRequest) {
        var notification = notificationService.updateNotification(id, notificationRequest);
        return ResponseEntity.ok(new ResponseObject.Builder<NotificationResponse>()
                .success(true)
                .code("SUCCESS")
                .content(notification)
                .message("Update Success")
                .build());
    }
}
