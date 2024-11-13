package com.system.admin.payload.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AddUsersToGroupRequest {
    private List<Long> userIds;

}