package com.system.admin.payload.request;

import com.system.admin.model.Role;
import com.system.admin.model.User;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserGroupRequest {
    private String name;
    private String description;
    private List<Long> userIds;
    private List<Long> roleIds;
}
