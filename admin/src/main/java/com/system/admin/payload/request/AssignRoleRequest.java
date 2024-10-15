package com.system.admin.payload.request;

import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class AssignRoleRequest {
    private Set<Long> userIds;
    private Set<Long> roleIds;

}
