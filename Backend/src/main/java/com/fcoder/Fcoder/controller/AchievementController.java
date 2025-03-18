package com.fcoder.Fcoder.controller;

import com.fcoder.Fcoder.model.dto.request.AchievementRequest;
import com.fcoder.Fcoder.model.dto.request.QueryWrapper;
import com.fcoder.Fcoder.model.dto.response.AchievementResponse;
import com.fcoder.Fcoder.model.dto.response.ResponseObject;
import com.fcoder.Fcoder.service.AchievementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/achievements", produces = MediaType.APPLICATION_JSON_VALUE)
public class AchievementController {
    private final AchievementService achievementService;

    @Operation(summary = "Get all achievements")
    @GetMapping
    public ResponseEntity<ResponseObject<List<AchievementResponse>>> getAllAchievements(@RequestParam(name = "q", required = false) String query,
                                                                                        @PageableDefault(page = 0, size = 10) Pageable pageable) {
        var achievements = achievementService.getAllAchievements(QueryWrapper.builder().search(query).build());
        return ResponseEntity.ok(new ResponseObject.Builder<List<AchievementResponse>>()
                .success(true)
                .code("SUCCESS")
                .content(achievements.getData())
                .message("Get Success")
                .build());
    }

    @Operation(summary = "Get achievement by ID")
    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject<AchievementResponse>> getAchievementById(@PathVariable Long id) {
        var achievement = achievementService.getAchievementById(id);
        return ResponseEntity.ok(new ResponseObject.Builder<AchievementResponse>()
                .success(true)
                .code("SUCCESS")
                .content(achievement)
                .message("Get Success")
                .build());
    }

    @Operation(summary = "Create a new achievement", security = {@SecurityRequirement(name = "accessCookie")})
    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_HOC')")
    public ResponseEntity<ResponseObject<AchievementResponse>> createAchievement(@RequestBody AchievementRequest achievementRequest) {
        var achievement = achievementService.createAchievement(achievementRequest);
        return ResponseEntity.ok(new ResponseObject.Builder<AchievementResponse>()
                .success(true)
                .code("SUCCESS")
                .content(achievement)
                .message("Create Success")
                .build());
    }

    @Operation(summary = "Update an achievement by ID", security = {@SecurityRequirement(name = "accessCookie")})
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_HOC')")
    public ResponseEntity<ResponseObject<AchievementResponse>> updateAchievement(@PathVariable Long id, @RequestBody AchievementRequest achievementRequest) {
        var achievement = achievementService.updateAchievement(id, achievementRequest);
        return ResponseEntity.ok(new ResponseObject.Builder<AchievementResponse>()
                .success(true)
                .code("SUCCESS")
                .content(achievement)
                .message("Update Success")
                .build());
    }

    @Operation(summary = "Delete an achievement by ID", security = {@SecurityRequirement(name = "accessCookie")})
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_HOC')")
    public ResponseEntity<ResponseObject<Void>> deleteAchievement(@PathVariable Long id) {
        achievementService.deleteAchievement(id);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Delete Success")
                .build());
    }

    @Operation(summary = "Get achievements by user ID", security = {@SecurityRequirement(name = "accessCookie")})
    @GetMapping("/user/{userId}")
    public ResponseEntity<ResponseObject<List<AchievementResponse>>> getAchievementsByUserId(@PathVariable Long userId) {
        var achievements = achievementService.getAchievementsByUserId(userId);
        return ResponseEntity.ok(new ResponseObject.Builder<List<AchievementResponse>>()
                .success(true)
                .code("SUCCESS")
                .content(achievements)
                .message("Get Success")
                .build());
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_HOC')")
    @Operation(summary = "Partially update an achievement by ID", security = {@SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<AchievementResponse>> patchAchievement(@PathVariable Long id, @RequestBody AchievementRequest achievementRequest) {
        var achievement = achievementService.patchAchievement(id, achievementRequest);
        return ResponseEntity.ok(new ResponseObject.Builder<AchievementResponse>()
                .success(true)
                .code("SUCCESS")
                .content(achievement)
                .message("Patch Success")
                .build());
    }
}
