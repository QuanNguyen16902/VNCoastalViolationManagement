package com.system.admin.controller;

import com.system.admin.LogUtils;
import com.system.admin.exception.RoleNotFoundException;
import com.system.admin.model.Role;
import com.system.admin.security.auth_service.UserDetailsImpl;
import com.system.admin.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author Admin
 */
import com.system.admin.model.SystemLog;
import com.system.admin.service.SystemLogService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

// Các import khác

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/admin")
public class RoleController {
    @Autowired
    private RoleService roleService;

    @Autowired
    private SystemLogService logService;

    @Autowired
    private LogUtils logUtils;

    @GetMapping("/roles")
    public ResponseEntity<?> getAll() {
        List<Role> roles = roleService.getAll();
        // Ghi nhật ký
//        logUtils.logAction("GET", "Fetched all roles", null);
        return ResponseEntity.ok(roles);
    }

    @GetMapping("/roles/search")
    public List<Role> searchRole(@RequestParam("keyword") String keyword) {
        List<Role> roles = roleService.searchRoles(keyword);
        // Ghi nhật ký
        logUtils.logAction("SEARCH", "Tìm kiếm quyền với từ khóa: " + keyword, null);
        return roles;
    }

    @PostMapping("/roles")
    public ResponseEntity<?> save(@RequestBody Role role) {
        try {
            roleService.save(role);
            // Ghi nhật ký
            logUtils.logAction("POST", "Thêm quyền mới: " + role.getName(), null);
            return ResponseEntity.accepted().body("Tạo role thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Có lỗi xảy ra khi tạo role: " + e.getMessage());
        }
    }

    @GetMapping("/roles/{id}")
    public ResponseEntity<?> get(@PathVariable("id") Long id) {
        try {
            Role role = roleService.getRoleById(id);
            // Ghi nhật ký
//            logUtils.logAction("GET", "Fetched role with ID: " + id, role.getName());
            return ResponseEntity.ok(role);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/roles/{id}")
    public ResponseEntity<?> updateRole(@PathVariable("id") Long id, @RequestBody Role role) {
        try {
            Role existingRole = roleService.getRoleById(id);
            if (existingRole == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy role với ID: " + id);
            }

            existingRole.setName(role.getName());
            existingRole.setLink(role.getLink());
            existingRole.setDescription(role.getDescription());

            roleService.save(existingRole);

            // Ghi nhật ký
            logUtils.logAction("PUT", "Cập nhật quyền với ID: " + id + ", ", existingRole.getName());
            return ResponseEntity.ok("Cập nhật role thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Có lỗi xảy ra khi cập nhật role: " + e.getMessage());
        }
    }

    @DeleteMapping("/roles/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
        try {
            roleService.deleteRole(id);
            // Ghi nhật ký
            logUtils.logAction("DELETE", "Xóa quyền với ID: " + id, null);
            return ResponseEntity.accepted().body("Xóa role thành công");
        } catch (RoleNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Không có role nào id là " + id);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi khi xóa role");
        }
    }
//
//    // Phương thức ghi nhật ký
//    private void logUtils.logAction(String action, String details, String roleName) {
//        SystemLog log = new SystemLog();
//        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//        Long userId = (auth.getPrincipal() instanceof UserDetailsImpl) ? ((UserDetailsImpl) auth.getPrincipal()).getId() : null;
//
//        log.setAction(action);
//        log.setDetails(details + (roleName != null ? " Role Name: " + roleName : ""));
//        log.setUserId(userId);
//        logService.save(log);
//    }
}

