package com.system.admin;

import com.system.admin.model.SystemLog;
import com.system.admin.model.User;
import com.system.admin.security.auth_service.UserDetailsImpl;
import com.system.admin.service.SystemLogService;
import com.system.admin.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class LogUtils {
    private final SystemLogService logService;

    @Autowired
    private UserService userService;
    // Inject LogService
    public LogUtils(SystemLogService logService) {
        this.logService = logService;
    }

    public void logAction(String action, String details, String name) {
        // Tạo một đối tượng SystemLog mới
        SystemLog log = new SystemLog();

        // Lấy thông tin người dùng từ SecurityContext
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = null;

        // Kiểm tra xem người dùng đã đăng nhập chưa và lấy đối tượng User
        if (auth.getPrincipal() instanceof UserDetailsImpl userDetails) {
            user = userService.getById(userDetails.getId()); // Giả định rằng bạn có phương thức tìm User theo ID
        }

        // Thiết lập thông tin cho log
        log.setAction(action);
        log.setDetails(details + (name != null ? " tên: " + name : ""));
        log.setUser(user); // Thiết lập đối tượng User cho log

        // Lưu log vào cơ sở dữ liệu
        logService.save(log);
    }

}
