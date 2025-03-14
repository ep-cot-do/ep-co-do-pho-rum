package com.fcoder.Fcoder.model.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RoleResponse {
    private Long id;
    private String roleName;
}