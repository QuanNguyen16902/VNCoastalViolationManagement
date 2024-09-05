package com.system.admin.controller;

import com.system.admin.LogUtils;
import com.system.admin.exception.EmailAlreadyExistsException;
import com.system.admin.exception.RoleNotFoundException;
import com.system.admin.exception.UserNotFoundException;
import com.system.admin.exception.UsernameAlreadyExistsException;
import com.system.admin.model.SystemLog;
import com.system.admin.model.User;
import com.system.admin.security.auth_service.UserDetailsImpl;
import com.system.admin.service.SystemLogService;
import com.system.admin.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

// Các import khác

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/admin")
public class UserController {
    private UserService userService;
    private SystemLogService logService;  // Thêm dependency
    @Autowired
    private LogUtils logUtils;
    @Autowired
    public UserController(UserService userService, SystemLogService logService) {
        this.userService = userService;
        this.logService = logService;
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUser() {
        List<User> userList = userService.getAll();
        // Ghi nhật ký
//        logUtils.logAction("GET", "Fetched all users", null);
        return ResponseEntity.ok().body(userList);
    }

    @GetMapping("/users/search")
    public List<User> searchUsers(@RequestParam("keyword") String keyword) {
        List<User> users = userService.searchUsers(keyword);
        // Ghi nhật ký
        logUtils.logAction("SEARCH", "Tìm kiếm người dùng với keyword: " + keyword, null);
        return users;
    }

    @PostMapping("/users")
    public ResponseEntity<?> saveUser(@Valid @RequestBody User user, BindingResult result) {
        if (result.hasErrors()) {
            HashMap<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
            // Ghi nhật ký lỗi
            logUtils.logAction("CREATE", "Lỗi thêm người dùng", user.getUsername() + ": " + errors.toString());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
        }
        try {
            userService.save(user);
            // Ghi nhật ký thành công
            logUtils.logAction("CREATE", "Thêm người dùng mới", user.getUsername());
            return ResponseEntity.status(HttpStatus.CREATED).body("Thêm người dùng thành công");
        } catch (EmailAlreadyExistsException | UsernameAlreadyExistsException | RoleNotFoundException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<String> updateUser(@PathVariable("id") Long id, @RequestBody User user) {
        try {
            userService.updateUser(id, user);
            // Ghi nhật ký
            logUtils.logAction("UPDATE", "Cập nhật người dùng với ID: " + id + ", ", user.getUsername());
            return ResponseEntity.ok("Cập nhật người dùng thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<?> get(@PathVariable("id") Long id) {
        try {
            User user = userService.getById(id);
            // Ghi nhật ký
//            logUtils.logAction("GET", "Fetched người dùng theo ID: " + id, user.getUsername());
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
        try {
            userService.deleteById(id);
            // Ghi nhật ký
            logUtils.logAction("DELETE", "Xóa người dùng với ID: " + id, null);
            return ResponseEntity.accepted().body("Xóa User thành công");
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Không có User nào id là " + id);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi khi xóa User");
        }
    }

    // Phương thức ghi nhật ký
//    private void logAction(String action, String details, String username) {
//        SystemLog log = new SystemLog();
//        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//        Long userId = (auth.getPrincipal() instanceof UserDetailsImpl) ? ((UserDetailsImpl) auth.getPrincipal()).getId() : null;
//
//        log.setAction(action);
//        log.setDetails(details);
//        log.setUserId(userId);
//        logService.save(log);
//    }
}
