package com.system.admin.service;

import com.system.admin.exception.PermissionNotFoundException;
import com.system.admin.exception.UserNotFoundException;
import com.system.admin.model.Permission;
import com.system.admin.repository.PermissionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PermissionService {
    private PermissionRepository permissionRepository;

    @Autowired
    public PermissionService(PermissionRepository permissionRepository) {
        this.permissionRepository = permissionRepository;
    }

    public List<Permission> getAll(){
        return permissionRepository.findAll();
    }
    public Permission savePermission(Permission permission){
        return permissionRepository.save(permission);
    }
    public Optional<Permission> findById(Long id){
        return permissionRepository.findById(id);
    }

    public Permission updatePermission(Long id, Permission permission){
        Permission updatePermission = permissionRepository.findById(id).orElseThrow(() -> new UserNotFoundException("Không tìm thấy quyền với ID " + id));
        updatePermission.setName(permission.getName());
        updatePermission.setDescription(permission.getDescription());
        permissionRepository.save(updatePermission);
        return updatePermission;
    }

    public void deleteById(Long id){
        permissionRepository.deleteById(id);
    }
    @Transactional
    public void deletePermission(Long id){
        if(!permissionRepository.existsById(id)){
            throw new PermissionNotFoundException("Không tồn tại Permission với id " + id);
        }
        permissionRepository.deleteById(id);
    }

}
