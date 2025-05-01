package com.fcoder.Fcoder.service;

import com.fcoder.Fcoder.model.dto.request.QueryWrapper;
import com.fcoder.Fcoder.model.dto.request.RoleRequest;
import com.fcoder.Fcoder.model.dto.response.PaginationWrapper;
import com.fcoder.Fcoder.model.dto.response.RoleResponse;

import java.util.List;

public interface RoleService {
    RoleResponse createRole(RoleRequest roleRequest);

    RoleResponse updateRole(RoleRequest roleRequest);

    RoleResponse deleteRole(Long id);

    RoleResponse getRole(Long id);

    PaginationWrapper<List<RoleResponse>> getAllRole (QueryWrapper queryWrapper);
}