package com.fcoder.Fcoder.service.impl;

import com.fcoder.Fcoder.model.dto.request.QueryWrapper;
import com.fcoder.Fcoder.model.dto.request.RoleRequest;
import com.fcoder.Fcoder.model.dto.response.PaginationWrapper;
import com.fcoder.Fcoder.model.dto.response.RoleResponse;
import com.fcoder.Fcoder.model.entity.RoleEntity;
import com.fcoder.Fcoder.model.exception.ActionFailedException;
import com.fcoder.Fcoder.model.exception.ValidationException;
import com.fcoder.Fcoder.repository.RoleRepository;
import com.fcoder.Fcoder.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    @Override
    public PaginationWrapper<List<RoleResponse>> getAllRole(QueryWrapper queryWrapper) {
        return roleRepository.query(queryWrapper, (param) -> (root, query, criteriaBuilder) -> {
            if (param == null || param.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.and(roleRepository.createDefaultPredicate(criteriaBuilder, root, param));
        }, (items) -> {
            var list = items.map(this::wrapRoleResponse).stream().toList();
            return new PaginationWrapper.Builder<List<RoleResponse>>()
                    .setPaginationInfo(items)
                    .setData(list)
                    .build();
        });
    }

    @Override
    public RoleResponse getRole(Long id) {
        var role = roleRepository.findById(id).orElseThrow(() -> new ValidationException("Role not found"));
        return wrapRoleResponse(role);
    }

    @Override
    @Transactional(isolation = Isolation.REPEATABLE_READ, rollbackFor = ActionFailedException.class)
    public RoleResponse createRole(RoleRequest roleRequest) {
        var role = RoleEntity.builder()
                .roleName(roleRequest.getRoleName())
                .build();
        roleRepository.save(role);
        return wrapRoleResponse(role);
    }

    @Override
    @Transactional(isolation = Isolation.REPEATABLE_READ, rollbackFor = ActionFailedException.class)
    public RoleResponse updateRole(RoleRequest roleRequest) {
        var role = roleRepository.findById(roleRequest.getId())
                .orElseThrow(() -> new ValidationException("Role not found"));
        role.setRoleName(roleRequest.getRoleName());
        roleRepository.save(role);
        return wrapRoleResponse(role);
    }

    @Override
    @Transactional(isolation = Isolation.REPEATABLE_READ, rollbackFor = ActionFailedException.class)
    public RoleResponse deleteRole(Long id) {
        var role = roleRepository.findById(id).orElseThrow(() -> new ValidationException("Role not found"));
        try {
            roleRepository.delete(role);
            return wrapRoleResponse(role);
        } catch (Exception e) {
            throw new ActionFailedException(e.getMessage());
        }
    }

    private RoleResponse wrapRoleResponse(RoleEntity roleEntity) {
        return RoleResponse.builder()
                .id(roleEntity.getId())
                .roleName(roleEntity.getRoleName())
                .build();
    }
}
