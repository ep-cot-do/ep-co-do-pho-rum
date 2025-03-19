package com.fcoder.Fcoder.controller;

import com.fcoder.Fcoder.model.dto.response.ResponseObject;
import com.fcoder.Fcoder.model.entity.AccountEntity;
import com.fcoder.Fcoder.repository.AccountRepository;
import com.fcoder.Fcoder.service.EmailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.List;
@RestController
@RequiredArgsConstructor
@RequestMapping("test/email")
public class EmailTestController {

    private final EmailService emailService;
    private final AccountRepository accountRepository;

    @PostMapping("/payment-reminder/{userId}")
    @Operation(summary = "Send test payment reminder email to specific user",
            security = {@SecurityRequirement(name = "accessCookie")}
    )
    public ResponseEntity<ResponseObject<String>> sendTestPaymentReminderEmail(@PathVariable Long userId) {
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
            emailService.sendPaymentReminderEmail(account);

            return ResponseEntity.ok(new ResponseObject.Builder<String>()
                    .success(true)
                    .code("SUCCESS")
                    .content("Test payment reminder email sent")
                    .message("Payment reminder email sent to " + account.getEmail())
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

    @PostMapping("/payment-success/{userId}")
    @Operation(summary = "Send test payment success email to specific user",
            security = {@SecurityRequirement(name = "accessCookie")}
    )
    public ResponseEntity<ResponseObject<String>> sendTestPaymentSuccessEmail(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "TEST-TRANSACTION-12345") String transactionId,
            @RequestParam(defaultValue = "70000") BigDecimal amount) {

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
            emailService.sendPaymentSuccessEmail(account, transactionId, amount);

            return ResponseEntity.ok(new ResponseObject.Builder<String>()
                    .success(true)
                    .code("SUCCESS")
                    .content("Test payment success email sent")
                    .message("Payment success email sent to " + account.getEmail())
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

    @GetMapping("/trigger-quarterly-reminders")
    @Operation(summary = "Manually trigger quarterly payment reminders for all users",
            security = {@SecurityRequirement(name = "accessCookie")}
    )
    public ResponseEntity<ResponseObject<String>> triggerQuarterlyReminders() {
        try {
            // Get all accounts
            Iterable<AccountEntity> accounts = accountRepository.findAll();
            int count = 0;

            for (AccountEntity account : accounts) {
                emailService.sendPaymentReminderEmail(account);
                count++;
            }

            return ResponseEntity.ok(new ResponseObject.Builder<String>()
                    .success(true)
                    .code("SUCCESS")
                    .content("Quarterly payment reminders triggered")
                    .message("Sent " + count + " payment reminder emails")
                    .build());
        } catch (Exception e) {
            return ResponseEntity.ok(new ResponseObject.Builder<String>()
                    .success(false)
                    .code("EMAIL_SEND_FAILED")
                    .content("Failed to send emails: " + e.getMessage())
                    .message("Email sending failed")
                    .build());
        }
    }

    @GetMapping("/trigger-unpaid-reminders")
    @Operation(summary = "Manually trigger payment reminders for unpaid accounts",
            security = {@SecurityRequirement(name = "accessCookie")}
    )
    public ResponseEntity<ResponseObject<String>> triggerUnpaidReminders() {
        try {
            // Get unpaid accounts
            List<AccountEntity> unpaidAccounts = accountRepository.findByFundStatusFalse();
            int count = 0;

            for (AccountEntity account : unpaidAccounts) {
                emailService.sendPaymentReminderEmail(account);
                count++;
            }

            return ResponseEntity.ok(new ResponseObject.Builder<String>()
                    .success(true)
                    .code("SUCCESS")
                    .content("Unpaid accounts payment reminders triggered")
                    .message("Sent " + count + " payment reminder emails to unpaid accounts")
                    .build());
        } catch (Exception e) {
            return ResponseEntity.ok(new ResponseObject.Builder<String>()
                    .success(false)
                    .code("EMAIL_SEND_FAILED")
                    .content("Failed to send emails: " + e.getMessage())
                    .message("Email sending failed")
                    .build());
        }
    }
}