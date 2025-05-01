package com.fcoder.Fcoder.controller;

import com.fcoder.Fcoder.model.dto.request.QueryWrapper;
import com.fcoder.Fcoder.model.dto.request.RoleRequest;
import com.fcoder.Fcoder.model.dto.response.RoleResponse;
import com.fcoder.Fcoder.model.dto.response.ResponseObject;
import com.fcoder.Fcoder.service.RoleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "roles", produces = MediaType.APPLICATION_JSON_VALUE)
public class RoleController {
    private final RoleService roleService;

    @Operation(summary = "Get All Roles", security = {@SecurityRequirement(name = "accessCookie")})
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<ResponseObject<List<RoleResponse>>> getAllRoles(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,asc") String sort) {

        var pageable = PageRequest.of(page, size, Sort.by(Sort.Order.by(sort.split(",")[0]).with(Sort.Direction.fromString(sort.split(",")[1]))));

        var paginationResult = roleService.getAllRole(QueryWrapper.builder()
                .search(query)
                .wrapSort(pageable)
                .build());

        return ResponseEntity.ok(new ResponseObject.Builder<List<RoleResponse>>()
                .success(true)
                .code("SUCCESS")
                .content(paginationResult.getData())
                .message("Get Success")
                .build());
    }


    @Operation(summary = "Get Role By ID", security = {@SecurityRequirement(name = "accessCookie")})
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("{roleId}")
    public ResponseEntity<ResponseObject<RoleResponse>> getRoleById(@PathVariable Long roleId) {
        var role = roleService.getRole(roleId);
        return ResponseEntity.ok(new ResponseObject.Builder<RoleResponse>()
                .success(true)
                .code("SUCCESS")
                .content(role)
                .message("Get Success")
                .build());
    }

    @Operation(summary = "Create New Role", security = {@SecurityRequirement(name = "accessCookie")})
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<ResponseObject<RoleResponse>> createRole(@RequestBody RoleRequest roleRequest) {
        var role = roleService.createRole(roleRequest);
        return ResponseEntity.ok(new ResponseObject.Builder<RoleResponse>()
                .success(true)
                .code("SUCCESS")
                .content(role)
                .message("Create Success")
                .build());
    }

    @Operation(summary = "Update Role", security = {@SecurityRequirement(name = "accessCookie")})
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("{roleId}")
    public ResponseEntity<ResponseObject<RoleResponse>> updateRole(@PathVariable Long roleId, @RequestBody RoleRequest roleRequest) {
        var role = roleService.updateRole(roleRequest);
        return ResponseEntity.ok(new ResponseObject.Builder<RoleResponse>()
                .success(true)
                .code("SUCCESS")
                .content(role)
                .message("Update Success")
                .build());
    }

    @Operation(summary = "Delete Role", security = {@SecurityRequirement(name = "accessCookie")})
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("{roleId}")
    public ResponseEntity<ResponseObject<Void>> deleteRole(@PathVariable Long roleId) {
        roleService.deleteRole(roleId);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Delete Success")
                .build());
    }
}
