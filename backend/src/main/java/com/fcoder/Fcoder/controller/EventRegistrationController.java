package com.fcoder.Fcoder.controller;

import com.fcoder.Fcoder.model.dto.request.EventRegistrationRequest;
import com.fcoder.Fcoder.model.dto.request.QueryWrapper;
import com.fcoder.Fcoder.model.dto.response.EventRegistrationResponse;
import com.fcoder.Fcoder.model.dto.response.PaginationWrapper;
import com.fcoder.Fcoder.model.dto.response.ResponseObject;
import com.fcoder.Fcoder.service.EventRegistrationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/event-registrations", produces = MediaType.APPLICATION_JSON_VALUE)
public class EventRegistrationController {
    private final EventRegistrationService eventRegistrationService;

    @Operation(summary = "Get all event registrations", security = {@SecurityRequirement(name = "accessCookie")})
    @GetMapping
    public ResponseEntity<ResponseObject<PaginationWrapper<List<EventRegistrationResponse>>>> getAllEventRegistrations(
            @RequestParam(required = false) String query) {
        var registrations = eventRegistrationService.getAllEventRegistrations(QueryWrapper.builder().search(query).build());
        return ResponseEntity.ok(new ResponseObject.Builder<PaginationWrapper<List<EventRegistrationResponse>>>()
                .success(true)
                .code("SUCCESS")
                .content(registrations)
                .message("Get Success")
                .build());
    }

    @Operation(summary = "Get event registration by ID", security = {@SecurityRequirement(name = "accessCookie")})
    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject<EventRegistrationResponse>> getEventRegistrationById(@PathVariable Long id) {
        var registration = eventRegistrationService.getEventRegistrationById(id);
        return ResponseEntity.ok(new ResponseObject.Builder<EventRegistrationResponse>()
                .success(true)
                .code("SUCCESS")
                .content(registration)
                .message("Get Success")
                .build());
    }

    @Operation(summary = "Register for an event", security = {@SecurityRequirement(name = "accessCookie")})
    @PostMapping
    public ResponseEntity<ResponseObject<EventRegistrationResponse>> registerForEvent(
            @RequestBody EventRegistrationRequest registrationRequest) {
        var registration = eventRegistrationService.registerForEvent(registrationRequest);
        return ResponseEntity.ok(new ResponseObject.Builder<EventRegistrationResponse>()
                .success(true)
                .code("SUCCESS")
                .content(registration)
                .message("Registration Success")
                .build());
    }

    @Operation(summary = "Update event registration", security = {@SecurityRequirement(name = "accessCookie")})
    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject<EventRegistrationResponse>> updateEventRegistration(
            @PathVariable Long id, @RequestBody EventRegistrationRequest registrationRequest) {
        var registration = eventRegistrationService.updateEventRegistration(id, registrationRequest);
        return ResponseEntity.ok(new ResponseObject.Builder<EventRegistrationResponse>()
                .success(true)
                .code("SUCCESS")
                .content(registration)
                .message("Update Success")
                .build());
    }

    @Operation(summary = "Delete event registration", security = {@SecurityRequirement(name = "accessCookie")})
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject<Void>> deleteEventRegistration(@PathVariable Long id) {
        eventRegistrationService.deleteEventRegistration(id);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Delete Success")
                .build());
    }

    @Operation(summary = "Get registrations by event ID", security = {@SecurityRequirement(name = "accessCookie")})
    @GetMapping("/event/{eventId}")
    public ResponseEntity<ResponseObject<List<EventRegistrationResponse>>> getRegistrationsByEventId(
            @PathVariable Long eventId) {
        var registrations = eventRegistrationService.getRegistrationsByEventId(eventId);
        return ResponseEntity.ok(new ResponseObject.Builder<List<EventRegistrationResponse>>()
                .success(true)
                .code("SUCCESS")
                .content(registrations)
                .message("Get Success")
                .build());
    }

    @Operation(summary = "Get registrations by user ID", security = {@SecurityRequirement(name = "accessCookie")})
    @GetMapping("/user/{userId}")
    public ResponseEntity<ResponseObject<List<EventRegistrationResponse>>> getRegistrationsByUserId(
            @PathVariable Long userId) {
        var registrations = eventRegistrationService.getRegistrationsByUserId(userId);
        return ResponseEntity.ok(new ResponseObject.Builder<List<EventRegistrationResponse>>()
                .success(true)
                .code("SUCCESS")
                .content(registrations)
                .message("Get Success")
                .build());
    }

    @Operation(summary = "Deactivate event registration", security = {@SecurityRequirement(name = "accessCookie")})
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<ResponseObject<Void>> deactivateRegistration(@PathVariable Long id) {
        eventRegistrationService.deactivateRegistration(id);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Registration Deactivated Successfully")
                .build());
    }

    @Operation(summary = "Activate event registration (Admin and Header of club only)", security = {@SecurityRequirement(name = "accessCookie")})
    @PatchMapping("/{id}/activate")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_HOC')")
    public ResponseEntity<ResponseObject<Void>> activateRegistration(@PathVariable Long id) {
        eventRegistrationService.activateRegistration(id);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Registration Activated Successfully")
                .build());
    }

    @GetMapping("/title/{title}")
    @Operation(summary = "Get event event registration by title")
    public ResponseEntity<ResponseObject<List<EventRegistrationResponse>>> getEventRecapByTitle(@PathVariable String title) {
        List<EventRegistrationResponse> eventRecaps = eventRegistrationService.getEventRegistrationByEventTitle(title);
        return ResponseEntity.ok(new ResponseObject.Builder<List<EventRegistrationResponse>>()
                .success(true)
                .code("SUCCESS")
                .content(eventRecaps)
                .message("Get Success")
                .build());
    }
}
