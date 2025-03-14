package com.fcoder.Fcoder.controller;

import com.fcoder.Fcoder.model.dto.request.ChangePasswordRequest;
import com.fcoder.Fcoder.model.dto.response.ResponseObject;
import com.fcoder.Fcoder.service.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("accounts/password")
public class PasswordController {
    private final AccountService accountService;

    @PostMapping("reset")
    @Operation(summary = "Reset Password via Email",
            security = {}
    )
    public ResponseEntity<ResponseObject<Void>> resetPassword(@RequestParam String email) {
        accountService.resetPassword(email);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Password reset instructions sent")
                .build());
    }

    @PutMapping("change")
    @Operation(summary = "Change Account Password",
            security = {@SecurityRequirement(name = "accessCookie")}
    )
    public ResponseEntity<ResponseObject<Void>> changePassword(
            @Valid @RequestBody ChangePasswordRequest changePasswordRequest) {
        accountService.changePassword(changePasswordRequest);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Password changed successfully")
                .build());
    }
}