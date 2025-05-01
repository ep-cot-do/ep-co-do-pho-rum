package com.fcoder.Fcoder.controller;

import com.fcoder.Fcoder.cron.InactiveUserEmailCron;
import com.fcoder.Fcoder.model.dto.response.ResponseObject;
import com.fcoder.Fcoder.model.entity.AccountEntity;
import com.fcoder.Fcoder.repository.AccountRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("test/inactive-email")
public class InactiveUserEmailTestController {

    private final InactiveUserEmailCron inactiveUserEmailCron;
    private final AccountRepository accountRepository;

    @PostMapping("/send/{userId}")
    @Operation(summary = "Send test inactivity warning email to specific user",
            security = {@SecurityRequirement(name = "accessCookie")}
    )
    public ResponseEntity<ResponseObject<String>> sendTestInactivityEmail(@PathVariable Long userId) {
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
            inactiveUserEmailCron.sendInactivityWarningEmail(account);

            return ResponseEntity.ok(new ResponseObject.Builder<String>()
                    .success(true)
                    .code("SUCCESS")
                    .content("Test inactivity warning email sent")
                    .message("Inactivity warning email sent to " + account.getEmail())
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

    @GetMapping("/trigger-check")
    @Operation(summary = "Manually trigger inactive users check",
            security = {@SecurityRequirement(name = "accessCookie")}
    )
    public ResponseEntity<ResponseObject<String>> triggerInactiveUsersCheck() {
        try {
            inactiveUserEmailCron.checkInactiveUsers();

            return ResponseEntity.ok(new ResponseObject.Builder<String>()
                    .success(true)
                    .code("SUCCESS")
                    .content("Inactive users check triggered")
                    .message("Inactive users check completed successfully")
                    .build());
        } catch (Exception e) {
            return ResponseEntity.ok(new ResponseObject.Builder<String>()
                    .success(false)
                    .code("CHECK_FAILED")
                    .content("Failed to check inactive users: " + e.getMessage())
                    .message("Inactive users check failed")
                    .build());
        }
    }

    @GetMapping("/test-with-custom-threshold/{months}")
    @Operation(summary = "Test with custom inactivity threshold in months",
            security = {@SecurityRequirement(name = "accessCookie")}
    )
    public ResponseEntity<ResponseObject<String>> testWithCustomThreshold(@PathVariable int months) {
        try {
            LocalDateTime thresholdDate = LocalDateTime.now().minusMonths(months);
            List<AccountEntity> inactiveUsers = accountRepository.findInactiveUsers(thresholdDate);
            int count = 0;

            for (AccountEntity user : inactiveUsers) {
                inactiveUserEmailCron.sendInactivityWarningEmail(user);
                count++;
            }

            return ResponseEntity.ok(new ResponseObject.Builder<String>()
                    .success(true)
                    .code("SUCCESS")
                    .content("Custom threshold inactive users check triggered")
                    .message("Sent " + count + " inactivity warning emails (threshold: " + months + " months)")
                    .build());
        } catch (Exception e) {
            return ResponseEntity.ok(new ResponseObject.Builder<String>()
                    .success(false)
                    .code("CHECK_FAILED")
                    .content("Failed to check inactive users: " + e.getMessage())
                    .message("Custom threshold inactive users check failed")
                    .build());
        }
    }
}