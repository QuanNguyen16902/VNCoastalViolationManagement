package com.system.admin.controller;

import com.system.admin.LogUtils;
import com.system.admin.exception.RoleNotFoundException;
import com.system.admin.model.Permission;
import com.system.admin.model.Role;
import com.system.admin.model.UserGroup;
import com.system.admin.security.auth_service.UserDetailsImpl;
import com.system.admin.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import com.system.admin.service.SystemLogService;

// Các import khác

@CrossOrigin(origins = "*")
@RequestMapping("${API_URL}")
@RestController
@PreAuthorize("hasRole('ADMIN')")
public class RoleController {

    @Autowired
    private RoleService roleService;

    @Autowired
    private SystemLogService logService;

    @Autowired
    private LogUtils logUtils;

    @PreAuthorize("hasAuthority('VIEW_ROLE')")
    @GetMapping("/roles")
    public ResponseEntity<?> getAll() {
        try {
            List<Role> roles = roleService.getAll();
            return ResponseEntity.ok(roles);
        } catch (Exception e) {
            // Log lỗi và trả về phản hồi lỗi
            logUtils.logAction("ERROR", "Lỗi khi lấy tất cả quyền", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi lấy danh sách quyền");
        }
    }

    @GetMapping("/roles/search")
    public ResponseEntity<?> searchRole(@RequestParam("keyword") String keyword) {
        try {
            List<Role> roles = roleService.searchRoles(keyword);
            logUtils.logAction("SEARCH", "Tìm kiếm quyền với từ khóa: " + keyword, null);
            return ResponseEntity.ok(roles);
        } catch (Exception e) {
            logUtils.logAction("ERROR", "Lỗi khi tìm kiếm quyền", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi tìm kiếm quyền");
        }
    }

    @GetMapping("/roles/{roleId}/permissions")
    public ResponseEntity<?> getPermissionsForGroup(@PathVariable Long roleId) {
        try {
            Set<Permission> permissions = roleService.getPermissionsForRole(roleId);
            return ResponseEntity.ok(permissions);
        } catch (RoleNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy quyền với ID: " + roleId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi lấy danh sách quyền");
        }
    }

    @PostMapping("/roles/{roleId}/add-permission/{permissionId}")
    public ResponseEntity<?> addPermissionToRole(@PathVariable Long roleId, @PathVariable Long permissionId) {
        try {
            Role updatedRole = roleService.addPermissionToRole(roleId, permissionId);
            logUtils.logAction("UPDATE", "Thêm quyền " + permissionId + " vào role " + roleId, null);
            return ResponseEntity.ok(updatedRole);
        } catch (RoleNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy quyền với ID: " + roleId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi thêm quyền vào role");
        }
    }

    @PreAuthorize("hasAuthority('CREATE_ROLE')")
    @PostMapping("/roles")
    public ResponseEntity<?> save(@RequestBody Role role) {
        try {
            Role savedRole = roleService.save(role); // Lưu vai trò và lấy đối tượng đã lưu
            logUtils.logAction("CREATE", "Thêm quyền mới: " + savedRole.getName(), null);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedRole); // Trả về đối tượng role đã lưu
        } catch (AccessDeniedException e) {
            logUtils.logAction("ERROR", "Người dùng không có quyền thêm role", null);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Bạn không có quyền thực hiện hành động này");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
        } catch (RuntimeException e) {
            logUtils.logAction("ERROR", "Lỗi khi thêm role: " + e.getMessage(), null);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Đã xảy ra lỗi khi thêm quyền");
            errorResponse.put("details", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PreAuthorize("hasAuthority('EDIT_ROLE')")
    @GetMapping("/roles/{id}")
    public ResponseEntity<?> get(@PathVariable("id") Long id) {
        try {
            Role role = roleService.getRoleById(id);
            return ResponseEntity.ok(role);
        } catch (RoleNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy quyền với ID: " + id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi lấy quyền");
        }
    }

    @PreAuthorize("hasAuthority('EDIT_ROLE')")
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
            existingRole.setPermissions(role.getPermissions());

            roleService.save(existingRole);

            logUtils.logAction("UPDATE", "Cập nhật quyền với ID: " + id, existingRole.getName());
            return ResponseEntity.ok(existingRole);
        } catch (RoleNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy quyền với ID: " + id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Có lỗi xảy ra khi cập nhật role: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('DELETE_ROLE')")
    @DeleteMapping("/roles/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
        try {
            roleService.deleteRole(id);
            logUtils.logAction("DELETE", "Xóa quyền với ID: " + id, null);
            return ResponseEntity.accepted().body("Xóa role thành công");
        } catch (RoleNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không có role nào với ID là " + id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi khi xóa role");
        }
    }
    @PreAuthorize("hasAuthority('DELETE_ROLE')")
    @GetMapping("/roles/{id}/permissions")
    public ResponseEntity<?> getPermission(@PathVariable("id") Long id) {
        try {

            logUtils.logAction("DELETE", "Xóa quyền với ID: " + id, null);
            return ResponseEntity.accepted().body("Xóa role thành công");
        } catch (RoleNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không có role nào với ID là " + id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi khi xóa role");
        }
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

