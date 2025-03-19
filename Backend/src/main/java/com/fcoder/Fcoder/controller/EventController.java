package com.fcoder.Fcoder.controller;

import com.fcoder.Fcoder.model.dto.request.EventRequest;
import com.fcoder.Fcoder.model.dto.request.QueryWrapper;
import com.fcoder.Fcoder.model.dto.response.EventResponse;
import com.fcoder.Fcoder.model.dto.response.PaginationWrapper;
import com.fcoder.Fcoder.model.dto.response.ResponseObject;
import com.fcoder.Fcoder.service.EventService;
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
@RequestMapping(value = "/events", produces = MediaType.APPLICATION_JSON_VALUE)
public class EventController {
    private final EventService eventService;

    @Operation(summary = "Get all events")
    @GetMapping
    public ResponseEntity<ResponseObject<PaginationWrapper<List<EventResponse>>>> getAllEvents(@RequestParam(required = false) String query) {
        var events = eventService.getAllEvent(QueryWrapper.builder().search(query).build());
        return ResponseEntity.ok(new ResponseObject.Builder<PaginationWrapper<List<EventResponse>>>()
                .success(true)
                .code("SUCCESS")
                .content(events)
                .message("Get Success")
                .build());
    }

    @Operation(summary = "Get event by ID")
    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject<EventResponse>> getEventById(@PathVariable Long id) {
        var event = eventService.getEventById(id);
        return ResponseEntity.ok(new ResponseObject.Builder<EventResponse>()
                .success(true)
                .code("SUCCESS")
                .content(event)
                .message("Get Success")
                .build());
    }

    @Operation(summary = "Create a new event (Admin and Header of club only)", security = {@SecurityRequirement(name = "accessCookie")})
    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_HOC')")
    public ResponseEntity<ResponseObject<EventResponse>> createEvent(@RequestBody EventRequest eventRequest) {
        var event = eventService.createEvent(eventRequest);
        return ResponseEntity.ok(new ResponseObject.Builder<EventResponse>()
                .success(true)
                .code("SUCCESS")
                .content(event)
                .message("Create Success")
                .build());
    }

    @Operation(summary = "Update an event by ID (Admin and Header of club only)", security = {@SecurityRequirement(name = "accessCookie")})
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_HOC')")
    public ResponseEntity<ResponseObject<EventResponse>> updateEvent(@PathVariable Long id, @RequestBody EventRequest eventRequest) {
        var event = eventService.updateEvent(id, eventRequest);
        return ResponseEntity.ok(new ResponseObject.Builder<EventResponse>()
                .success(true)
                .code("SUCCESS")
                .content(event)
                .message("Update Success")
                .build());
    }

    @Operation(summary = "Delete an event by ID (Admin only)", security = {@SecurityRequirement(name = "accessCookie")})
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ResponseObject<Void>> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Delete Success")
                .build());
    }

    @Operation(summary = "Hide an event by ID (Admin and Header of club only)", security = {@SecurityRequirement(name = "accessCookie")})
    @PatchMapping("/{id}/hide")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_HOC')")
    public ResponseEntity<ResponseObject<Void>> hideEvent(@PathVariable Long id, @RequestParam Long requestUserId) {
        eventService.hideEvent(id, requestUserId);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Event Hidden Successfully")
                .build());
    }

    @Operation(summary = "Show an event by ID (Admin and Header of club only)", security = {@SecurityRequirement(name = "accessCookie")})
    @PatchMapping("/{id}/show")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_HOC')")
    public ResponseEntity<ResponseObject<Void>> showEvent(@PathVariable Long id) {
        eventService.showEvent(id);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Event Shown Successfully")
                .build());
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update event details by ID (Admin and Header of club only)", security = {@SecurityRequirement(name = "accessCookie")})
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_HOC')")
    public ResponseEntity<ResponseObject<Void>> updateEventDetails(@PathVariable Long id,
                                                                   @RequestParam EventRequest eventRequest) {
        eventService.updateEvent(id, eventRequest);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Event Status Updated Successfully")
                .build());
    }
}
