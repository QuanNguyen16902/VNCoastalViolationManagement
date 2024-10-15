package com.system.admin.service;

import com.system.admin.exception.UserNotFoundException;
import com.system.admin.model.Permission;
import com.system.admin.model.Role;
import com.system.admin.model.User;
import com.system.admin.model.UserGroup;
import com.system.admin.repository.RoleRepository;
import com.system.admin.repository.UserGroupRepository;
import com.system.admin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class UserGroupService {

    @Autowired
    private UserGroupRepository userGroupRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;

    public UserGroup createUserGroup(UserGroup userGroup) {

        return userGroupRepository.save(userGroup);
    }

    public UserGroup addUserToGroup(Long groupId, Long userId) {
        UserGroup group = userGroupRepository.findById(groupId).orElseThrow(() -> new RuntimeException("Group not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        group.getUsers().add(user);
        return userGroupRepository.save(group);
    }
    public UserGroup addRoleToGroup(Long groupId, Long roleId) {
        UserGroup group = userGroupRepository.findById(groupId).orElseThrow(() -> new RuntimeException("Group not found"));
        Role role = roleRepository.findById(roleId).orElseThrow(() -> new RuntimeException("Role not found"));

        group.getRoles().add(role);
        return userGroupRepository.save(group);
    }

    public List<UserGroup> getAllUserGroups() {
        return userGroupRepository.findAll();
    }

    public Optional<UserGroup> getUserGroupById(Long id) {
        return userGroupRepository.findById(id);
    }

    public UserGroup updateUserGroup(Long id,  String name, String description, List<Long> userIds, List<Long> roleIds) {
        UserGroup existingGroup = userGroupRepository.findById(id).orElseThrow(() -> new RuntimeException("Group not found"));
        existingGroup.setName(name);
        existingGroup.setDescription(description);

        // Tìm danh sách users dựa trên ID
        if (userIds != null && !userIds.isEmpty()) {
            Set<User> users = new HashSet<>(userRepository.findAllById(userIds));
            existingGroup.setUsers(users);
        }

        // Tìm danh sách roles dựa trên ID
        if (roleIds != null && !roleIds.isEmpty()) {
            Set<Role> roles = new HashSet<>(roleRepository.findAllById(roleIds));
            existingGroup.setRoles(roles);
        }

        return userGroupRepository.save(existingGroup);
    }

    public void deleteUserGroup(Long id) {
        userGroupRepository.deleteById(id);
    }
}

