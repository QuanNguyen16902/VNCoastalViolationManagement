package com.system.admin.controller;

import com.system.admin.model.Permission;
import com.system.admin.model.UserGroup;
import com.system.admin.payload.request.AddUsersToGroupRequest;
import com.system.admin.payload.request.UserGroupRequest;
import com.system.admin.service.UserGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("${API_URL}")
public class UserGroupController {

    @Autowired
    private UserGroupService userGroupService;


    @GetMapping("/users-group")
    @PreAuthorize("hasAuthority('VIEW_GROUP')")
    public ResponseEntity<List<UserGroup>> getAllUserGroups() {
        List<UserGroup> groups = userGroupService.getAllUserGroups();
        return ResponseEntity.ok(groups);
    }

    @PreAuthorize("hasAuthority('CREATE_GROUP')")
    @PostMapping("/users-group")
    public ResponseEntity<?> createUserGroup(@RequestBody UserGroup userGroup) {

        UserGroup createdGroup = userGroupService.createUserGroup(userGroup);
        return ResponseEntity.ok().body(createdGroup);
    }


    @PostMapping("/users-group/{groupId}/add-users")
    public ResponseEntity<?> addUsersToGroup(
            @PathVariable Long groupId,
            @RequestBody AddUsersToGroupRequest request) {

        userGroupService.editUsersToGroup(groupId, request.getUserIds());

        return ResponseEntity.ok("Cập nhật thành công");
    }


    @GetMapping("/users-group/{id}")
    @PreAuthorize("hasAuthority('EDIT_GROUP')")
    public ResponseEntity<UserGroup> getUserGroupById(@PathVariable Long id) {
        return userGroupService.getUserGroupById(id)
                .map(ResponseEntity::ok)
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/users-group/{id}")
    @PreAuthorize("hasAuthority('EDIT_GROUP')")
    public ResponseEntity<UserGroup> updateUserGroup(@PathVariable Long id, @RequestBody UserGroupRequest userGroup) {
        UserGroup updatedGroup = userGroupService.updateUserGroup(id,
                                userGroup.getName(),
                                userGroup.getDescription(),
                                userGroup.getRoleIds());
        return ResponseEntity.ok(updatedGroup);
    }


    @DeleteMapping("/users-group/{id}")
    @PreAuthorize("hasAuthority('DELETE_GROUP')")
    public ResponseEntity<Void> deleteUserGroup(@PathVariable Long id) {
        userGroupService.deleteUserGroup(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}


