package com.system.admin.controller;

import com.system.admin.exception.UserNotFoundException;
import com.system.admin.model.Permission;
import com.system.admin.service.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class PermissionController {
    private PermissionService service;

    @Autowired
    public PermissionController(PermissionService service) {
        this.service = service;
    }

    @GetMapping("/permissions")
    public ResponseEntity<List<Permission>> findAll(){
        List<Permission> permissionList = service.getAll();
        return ResponseEntity.ok(permissionList);
    }
    @GetMapping("/permissions/{id}")
    public ResponseEntity<Permission> findOne(@PathVariable Long id){
        Permission permission = service.findById(id).orElseThrow(() -> new UserNotFoundException("Không tìm thấy người dùng"));
        return ResponseEntity.ok(permission);
    }

    @PostMapping("/permissions")
    public ResponseEntity<Permission> createPermissions(@RequestBody Permission permission){
        Permission newPermission = service.savePermission(permission);
        return ResponseEntity.ok(newPermission);
    }


    // Xóa phân quyền
    @DeleteMapping("/permissions/{permissionId}")
    public ResponseEntity<String> deletePermission(@PathVariable Long permissionId) {
        service.deleteById(permissionId);
        return ResponseEntity.ok("Xóa thành công ");
    }
}
