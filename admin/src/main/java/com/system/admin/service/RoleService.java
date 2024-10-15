package com.system.admin.service;

import com.system.admin.exception.RoleNotFoundException;
import com.system.admin.model.*;
import com.system.admin.model.Role;
import com.system.admin.repository.PermissionRepository;
import com.system.admin.repository.RoleRepository;
import com.system.admin.repository.RoleRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class RoleService {

    @Autowired
    public RoleRepository roleRepository;
    @Autowired
    public PermissionRepository permissionRepository;

    public List<Role> getAll(){
        return roleRepository.findAll();
    }
    public Role save(Role role){
        return roleRepository.save(role);
    }

    public Optional<Role> findByName(String name){
        return roleRepository.findByName(name);
    }

    public Role getRoleById(Long id){
        if(!roleRepository.existsById(id)){
            throw new RoleNotFoundException("Không tồn tại Role với id " + id);
        }
        return roleRepository.findById(id).orElse(null);
    }
    public List<Role> searchRoles(String keyword) {
        return roleRepository.searchRoles(keyword);
    }
    @Transactional
    public void deleteRole(Long id){
        if(!roleRepository.existsById(id)){
            throw new RoleNotFoundException("Không tồn tại Role với id " + id);
        }
        roleRepository.deleteById(id);
    }

    public Role addPermissionToRole(Long roleId, Long permissionId) {
        // Tìm kiếm role dựa trên roleId
        Role role = roleRepository.findById(roleId).orElseThrow(() -> new RuntimeException("Role not found"));

        // Tìm kiếm permission dựa trên permissionId
        Permission permission = permissionRepository.findById(permissionId).orElseThrow(() -> new RuntimeException("Permission not found"));

        // Thêm permission vào role
        role.getPermissions().add(permission);

        // Lưu lại role với permission mới
        return roleRepository.save(role);
    }

    public Set<Permission> getPermissionsForRole(Long roleId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found with id: " + roleId));
        return role.getPermissions();
    }

}
