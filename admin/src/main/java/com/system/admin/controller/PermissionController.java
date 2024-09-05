package com.system.admin.controller;

import com.system.admin.model.Permission;
import com.system.admin.service.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/admin")
public class PermissionController {
    @Autowired
    private PermissionService service;

    @GetMapping("/permissions")
    public ResponseEntity<?> findAll(){
        List<Permission> permissionList = service.getAll();
        return ResponseEntity.ok(permissionList);
    }

    @PostMapping("/permissions")
    public ResponseEntity<?> createPermissions(@RequestBody Permission permission){
        Permission newPermission = service.savePermission(permission);
        return ResponseEntity.ok(newPermission);
    }

    // Xóa phân quyền
    @DeleteMapping("/permissions/{permissionId}")
    public ResponseEntity<String> deletePermission(@PathVariable Long permissionId) {
        service.deleteById(permissionId);
        return ResponseEntity.ok("Xóa thành công");
    }
}
