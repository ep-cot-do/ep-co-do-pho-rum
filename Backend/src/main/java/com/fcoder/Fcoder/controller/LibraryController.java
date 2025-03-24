package com.fcoder.Fcoder.controller;

import com.fcoder.Fcoder.model.dto.request.LibraryRequest;
import com.fcoder.Fcoder.model.dto.request.QueryWrapper;
import com.fcoder.Fcoder.model.dto.response.LibraryResponse;
import com.fcoder.Fcoder.model.dto.response.ResponseObject;
import com.fcoder.Fcoder.service.LibraryService;
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
@RequestMapping(value = "/libraries", produces = MediaType.APPLICATION_JSON_VALUE)
public class LibraryController {
    private final LibraryService libraryService;

    @GetMapping
    @Operation(summary = "Get all libraries", description = "This API will return all libraries", security = {
            @SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<List<LibraryResponse>>> getAllLibraries(
            @RequestParam(name = "q", required = false) String query,
            @PageableDefault(page = 0, size = 10) Pageable pageable) {
        var result = libraryService.getAllLibraries(QueryWrapper.builder()
                .wrapSort(pageable)
                .search(query)
                .build());
        return ResponseEntity.ok(new ResponseObject.Builder<List<LibraryResponse>>()
                .success(true)
                .code("SUCCESS")
                .unwrapPaginationWrapper(result)
                .message("Libraries retrieved successfully")
                .build());
    }

    @Operation(summary = "Get library by ID", security = {@SecurityRequirement(name = "accessCookie")})
    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject<LibraryResponse>> getLibraryById(@PathVariable Long id) {
        var library = libraryService.getLibraryById(id);
        return ResponseEntity.ok(new ResponseObject.Builder<LibraryResponse>()
                .success(true)
                .code("SUCCESS")
                .content(library)
                .message("Get Success")
                .build());
    }

    @Operation(summary = "Create a new library (Admin and Header of club only)", security = {@SecurityRequirement(name = "accessCookie")})
    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_HOC')")
    public ResponseEntity<ResponseObject<LibraryResponse>> createLibrary(@RequestBody LibraryRequest libraryRequest) {
        var library = libraryService.createLibrary(libraryRequest);
        return ResponseEntity.ok(new ResponseObject.Builder<LibraryResponse>()
                .success(true)
                .code("SUCCESS")
                .content(library)
                .message("Create Success")
                .build());
    }

    @Operation(summary = "Update a library by ID (Admin and Header of club only)", security = {@SecurityRequirement(name = "accessCookie")})
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_HOC')")
    public ResponseEntity<ResponseObject<LibraryResponse>> updateLibraryDetails(@PathVariable Long id,
                                                                                @RequestBody LibraryRequest libraryRequest) {
        var library = libraryService.updateLibrary(id, libraryRequest);
        return ResponseEntity.ok(new ResponseObject.Builder<LibraryResponse>()
                .success(true)
                .code("SUCCESS")
                .content(library)
                .message("Update Success")
                .build());
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_HOC')")
    @Operation(summary = "Update a library by ID (Admin and Header of club only)", security = {@SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<LibraryResponse>> updateLibrary(@PathVariable Long id,
                                                                         @RequestBody LibraryRequest libraryRequest) {
        var library = libraryService.updateLibrary(id, libraryRequest);
        return ResponseEntity.ok(new ResponseObject.Builder<LibraryResponse>()
                .success(true)
                .code("SUCCESS")
                .content(library)
                .message("Update Success")
                .build());
    }

    @PatchMapping("/show/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_HOC')")
    @Operation(summary = "Show a library by ID (Admin and Header of club only)", security = {@SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<Void>> showLibrary(@PathVariable Long id) {
        libraryService.showLibrary(id);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Show Success")
                .build());
    }

    @PatchMapping("/hide/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_HOC')")
    @Operation(summary = "Hide a library by ID (Admin and Header of club only)", security = {@SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<Void>> hideLibrary(@PathVariable Long id) {
        libraryService.hideLibrary(id);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Hide Success")
                .build());
    }

    @Operation(summary = "Delete a library by ID (Admin only)", security = {@SecurityRequirement(name = "accessCookie")})
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ResponseObject<Void>> deleteLibrary(@PathVariable Long id) {
        libraryService.deleteLibrary(id);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Delete Success")
                .build());
    }

    @GetMapping("/filter")
    @Operation(summary = "Filter libraries", security = {@SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<List<LibraryResponse>>>
    filterLibraries(@RequestParam(required = false) Integer semester,
                    @RequestParam(required = false) String major,
                    @RequestParam(required = false) String subjectCode,
                    @RequestParam(required = false) String type,
                    @RequestParam(required = false) String status,
                    @RequestParam(required = false) Long authorId) {
        var libraries = libraryService.filterLibraries(semester, major, subjectCode, type, status, authorId);
        return ResponseEntity.ok(new ResponseObject.Builder<List<LibraryResponse>>()
                .success(true)
                .code("SUCCESS")
                .content(libraries)
                .message("Filter Success")
                .build());
    }
}