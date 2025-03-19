package com.fcoder.Fcoder.controller;

import com.fcoder.Fcoder.cron.BirthdayEmailCron;
import com.fcoder.Fcoder.model.dto.response.ProfileResponse;
import com.fcoder.Fcoder.model.dto.response.ResponseObject;
import com.fcoder.Fcoder.model.entity.AccountEntity;
import com.fcoder.Fcoder.repository.AccountRepository;
import com.fcoder.Fcoder.service.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("test/birthday")
public class BirthdayTestController {

    private final BirthdayEmailCron birthdayEmailCron;
    private final AccountRepository accountRepository;
    private final AccountService accountService;

    @GetMapping("/birthdays/today")
    @Operation(summary = "Get users with birthdays today",
            security = {@SecurityRequirement(name = "accessCookie")}
    )
    public ResponseEntity<ResponseObject<List<ProfileResponse>>> getUsersWithBirthdayToday() {
        List<ProfileResponse> birthdayUsers = accountService.getUsersWithBirthdayToday();
        return ResponseEntity.ok(new ResponseObject.Builder<List<ProfileResponse>>()
                .success(true)
                .code("SUCCESS")
                .content(birthdayUsers)
                .message(birthdayUsers.isEmpty() ? "No birthdays today" : "Found " + birthdayUsers.size() + " users with birthdays today")
                .build());
    }


    @PostMapping("/test-send-email/{userId}")
    @Operation(summary = "Send test birthday email to specific user",
            security = {@SecurityRequirement(name = "accessCookie")}
    )
    public ResponseEntity<ResponseObject<String>> sendTestBirthdayEmail(@PathVariable Long userId) {
        Optional<AccountEntity> accountOpt = accountRepository.findById(userId);

        if (accountOpt.isEmpty()) {
            return ResponseEntity.ok(new ResponseObject.Builder<String>()
                    .success(false)
                    .code("USER_NOT_FOUND")
                    .content("User with ID " + userId + " not found")
                    .message("User not found")
                    .build());
        }

        try {
            AccountEntity account = accountOpt.get();
            birthdayEmailCron.sendBirthdayEmail(account);

            return ResponseEntity.ok(new ResponseObject.Builder<String>()
                    .success(true)
                    .code("SUCCESS")
                    .content("Test birthday email sent")
                    .message("Birthday email sent to " + account.getEmail())
                    .build());
        } catch (Exception e) {
            return ResponseEntity.ok(new ResponseObject.Builder<String>()
                    .success(false)
                    .code("EMAIL_SEND_FAILED")
                    .content("Failed to send email: " + e.getMessage())
                    .message("Email sending failed")
                    .build());
        }
    }
}