package com.system.admin;

import com.system.admin.model.SystemLog;
import com.system.admin.security.auth_service.UserDetailsImpl;
import com.system.admin.service.SystemLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class LogUtils {
    private final SystemLogService logService;

    // Inject LogService
    public LogUtils(SystemLogService logService) {
        this.logService = logService;
    }

    public void logAction(String action, String details, String name) {
        SystemLog log = new SystemLog();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (auth.getPrincipal() instanceof UserDetailsImpl) ? ((UserDetailsImpl) auth.getPrincipal()).getId() : null;

        log.setAction(action);
        log.setDetails(details + (name != null ? "tên: " + name : ""));
        log.setUserId(userId);
        logService.save(log);
    }
}
