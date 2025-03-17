package com.fcoder.Fcoder.controller;

import com.fcoder.Fcoder.model.dto.request.EventRecapRequest;
import com.fcoder.Fcoder.model.dto.request.QueryWrapper;
import com.fcoder.Fcoder.model.dto.response.EventRecapResponse;
import com.fcoder.Fcoder.model.dto.response.PaginationWrapper;
import com.fcoder.Fcoder.model.dto.response.ResponseObject;
import com.fcoder.Fcoder.service.EventRecapService;
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
@RequestMapping(value = "/event-recaps", produces = MediaType.APPLICATION_JSON_VALUE)
public class EventRecapController {
    private final EventRecapService eventRecapService;

    @Operation(summary = "Get all event recaps", security = {@SecurityRequirement(name = "accessCookie")})
    @GetMapping
    public ResponseEntity<ResponseObject<PaginationWrapper<List<EventRecapResponse>>>> getAllEventRecaps(@RequestParam(required = false) String query) {
        var eventRecaps = eventRecapService.getAllEventRecaps(QueryWrapper.builder().search(query).build());
        return ResponseEntity.ok(new ResponseObject.Builder<PaginationWrapper<List<EventRecapResponse>>>()
                .success(true)
                .code("SUCCESS")
                .content(eventRecaps)
                .message("Get Success")
                .build());
    }

    @Operation(summary = "Get event recap by ID", security = {@SecurityRequirement(name = "accessCookie")})
    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject<EventRecapResponse>> getEventRecapById(@PathVariable Long id) {
        var eventRecap = eventRecapService.getEventRecapById(id);
        return ResponseEntity.ok(new ResponseObject.Builder<EventRecapResponse>()
                .success(true)
                .code("SUCCESS")
                .content(eventRecap)
                .message("Get Success")
                .build());
    }

    @Operation(summary = "Create a new event recap", security = {@SecurityRequirement(name = "accessCookie")})
    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_HOC')")
    public ResponseEntity<ResponseObject<EventRecapResponse>> createEventRecap(@RequestBody EventRecapRequest eventRecapRequest) {
        var eventRecap = eventRecapService.createEventRecap(eventRecapRequest);
        return ResponseEntity.ok(new ResponseObject.Builder<EventRecapResponse>()
                .success(true)
                .code("SUCCESS")
                .content(eventRecap)
                .message("Create Success")
                .build());
    }

    @Operation(summary = "Update an event recap by ID", security = {@SecurityRequirement(name = "accessCookie")})
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_HOC')")
    public ResponseEntity<ResponseObject<EventRecapResponse>> updateEventRecap(@PathVariable Long id, @RequestBody EventRecapRequest eventRecapRequest) {
        var eventRecap = eventRecapService.updateEventRecap(id, eventRecapRequest);
        return ResponseEntity.ok(new ResponseObject.Builder<EventRecapResponse>()
                .success(true)
                .code("SUCCESS")
                .content(eventRecap)
                .message("Update Success")
                .build());
    }

    @Operation(summary = "Delete an event recap by ID", security = {@SecurityRequirement(name = "accessCookie")})
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ResponseObject<Void>> deleteEventRecap(@PathVariable Long id) {
        eventRecapService.deleteEventRecap(id);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Delete Success")
                .build());
    }

    @Operation(summary = "Hide an event recap by ID", security = {@SecurityRequirement(name = "accessCookie")})
    @PatchMapping("/{id}/hide")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_HOC')")
    public ResponseEntity<ResponseObject<Void>> hideEventRecap(@PathVariable Long id, @RequestParam Long requestUserId) {
        eventRecapService.hideEventRecap(id, requestUserId);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Event Recap Hidden Successfully")
                .build());
    }

    @Operation(summary = "Show an event recap by ID", security = {@SecurityRequirement(name = "accessCookie")})
    @PatchMapping("/{id}/show")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_HOC')")
    public ResponseEntity<ResponseObject<Void>> showEventRecap(@PathVariable Long id) {
        eventRecapService.showEventRecap(id);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Event Recap Shown Successfully")
                .build());
    }

    @Operation(summary = "Update event recap details", security = {@SecurityRequirement(name = "accessCookie")})
    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_HOC')")
    public ResponseEntity<ResponseObject<Void>> updateEventRecapDetails(@PathVariable Long id,
                                                                        @RequestParam EventRecapRequest eventRecapRequest) {
        eventRecapService.updateEventRecap(id, eventRecapRequest);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Event Recap Updated Successfully")
                .build());
    }
}