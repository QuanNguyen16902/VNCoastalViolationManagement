package com.system.admin.service;

import com.system.admin.exception.PermissionNotFoundException;
import com.system.admin.exception.RoleNotFoundException;
import com.system.admin.model.Permission;
import com.system.admin.repository.PermissionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PermissionService {
    @Autowired
    private PermissionRepository permissionRepository;

    public List<Permission> getAll(){
        return permissionRepository.findAll();
    }
    public Permission savePermission(Permission permission){
        return permissionRepository.save(permission);
    }
    public Optional<Permission> findById(Long id){
        return permissionRepository.findById(id);
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
