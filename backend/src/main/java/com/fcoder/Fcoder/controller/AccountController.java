package com.fcoder.Fcoder.controller;

import com.fcoder.Fcoder.model.dto.request.AccountRegisterRequest;
import com.fcoder.Fcoder.model.dto.request.MemberAccountDetailRegisterRequest;
import com.fcoder.Fcoder.model.dto.request.ProfileRequest;
import com.fcoder.Fcoder.model.dto.response.MemberAccountRegisterResponse;
import com.fcoder.Fcoder.model.dto.response.ProfileResponse;
import com.fcoder.Fcoder.model.dto.response.ResponseObject;
import com.fcoder.Fcoder.service.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("accounts")
public class AccountController {
    private final AccountService accountService;

    @PostMapping("members/register/full")
    @Operation(summary = "Register Member Account",
            security = {}
    )
    public ResponseEntity<ResponseObject<MemberAccountRegisterResponse>> registerMemberAccountFull(@Valid @RequestBody MemberAccountDetailRegisterRequest request) {
        var result = accountService.registerMemberAccountFull(request);
        return ResponseEntity.ok(new ResponseObject.Builder<MemberAccountRegisterResponse>()
                .success(true)
                .code("SUCCESS")
                .content(result)
                .message("Create Success")
                .build());
    }

    @PostMapping("members/register")
    @Operation(summary = "Register Member Account",
            security = {}
    )
    public ResponseEntity<ResponseObject<MemberAccountRegisterResponse>> registerMemberAccount(@Valid @RequestBody AccountRegisterRequest request) {
        var result = accountService.registerMemberAccount(request);
        return ResponseEntity.ok(new ResponseObject.Builder<MemberAccountRegisterResponse>()
                .success(true)
                .code("SUCCESS")
                .content(result)
                .message("Create Success")
                .build());
    }

    @GetMapping("check-username")
    @Operation(summary = "Check Account Username Exist",
            security = {@SecurityRequirement(name = "accessCookie")}
    )
    public ResponseEntity<ResponseObject<Map<String, Boolean>>> validateUsername(@RequestParam String username) {
        var exist = accountService.checkUsernameExist(username);
        return ResponseEntity.ok(new ResponseObject.Builder<Map<String, Boolean>>()
                .success(true)
                .code("SUCCESS")
                .content(Map.of("exists", exist))
                .message(exist ? "Username Exist" : "Username Not Exist")
                .build());
    }

    @GetMapping("{id}")
    @Operation(summary = "Get Account By ID",
            security = {@SecurityRequirement(name = "accessCookie")}
    )
    public ResponseEntity<ResponseObject<MemberAccountRegisterResponse>> getAccountById(@PathVariable Long id) {
        var result = accountService.getAccountById(id);
        return ResponseEntity.ok(new ResponseObject.Builder<MemberAccountRegisterResponse>()
                .success(true)
                .code("SUCCESS")
                .content(result)
                .message("Get Account Success")
                .build());
    }

    @PatchMapping("disable/{id}")
    @Operation(summary = "Disable Account",
            security = {@SecurityRequirement(name = "accessCookie")}
    )
    public ResponseEntity<ResponseObject<Void>> disableAccount(@PathVariable Long id) {
        accountService.disableAccountById(id);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Account disabled successfully")
                .build());
    }

    @PatchMapping("enable/{id}")
    @Operation(summary = "Enable Account",
            security = {@SecurityRequirement(name = "accessCookie")}
    )
    public ResponseEntity<ResponseObject<Void>> enableAccount(@PathVariable Long id) {
        accountService.enableAccountById(id);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Account enable successfully")
                .build());
    }

    @PutMapping("{id}")
    @Operation(summary = "Update Account",
            security = {@SecurityRequirement(name = "accessCookie")}
    )
    public ResponseEntity<ResponseObject<ProfileResponse>> updateAccount(@PathVariable Long id,
                                                                         @Valid @RequestBody ProfileRequest request) {
        var result = accountService.updateMemberAccount(id, request);
        return ResponseEntity.ok(new ResponseObject.Builder<ProfileResponse>()
                .success(true)
                .code("SUCCESS")
                .content(result)
                .message("Update Success")
                .build());
    }

    @GetMapping("roles/me")
    @Operation(summary = "Get current account role", description = "This API will return current role", security = {
            @SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<List<String>>> getCurrentAccountRole() {
        var result = accountService.getUserCurrentRole();
        return ResponseEntity.ok(new ResponseObject.Builder<List<String>>()
                .success(true)
                .code("SUCCESS")
                .content(result)
                .message("Get account role successfully")
                .build());
    }

    @GetMapping("profile")
    @Operation(summary = "Get Profile",
            security = {@SecurityRequirement(name = "accessCookie")}
    )
    public ResponseEntity<ResponseObject<ProfileResponse>> getProfile() {
        var result = accountService.getProfile();
        return ResponseEntity.ok(new ResponseObject.Builder<ProfileResponse>()
                .success(true)
                .code("SUCCESS")
                .content(result)
                .message("Get Profile Success")
                .build());
    }

    @GetMapping("profile/{studentCode}")
    @Operation(summary = "Get Member By Student Code",
            security = {@SecurityRequirement(name = "accessCookie")}
    )
    public ResponseEntity<ResponseObject<ProfileResponse>> getMemberByStudentCode(@PathVariable String studentCode) {
        var result = accountService.getMemberByStudentCode(studentCode);
        return ResponseEntity.ok(new ResponseObject.Builder<ProfileResponse>()
                .success(true)
                .code("SUCCESS")
                .content(result)
                .message("Get Profile Success")
                .build());
    }
}