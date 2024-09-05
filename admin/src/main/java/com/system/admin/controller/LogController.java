package com.system.admin.controller;

import com.system.admin.model.SystemLog;
import com.system.admin.service.SystemLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
public class LogController {
    @Autowired
    private SystemLogService systemLogService;

    @GetMapping("/logs")
    public List<SystemLog> getAllSystemLogs() {
        return systemLogService.getAllLogs();
    }
    @PostMapping("/logs")
    public SystemLog createSystemLog(@RequestBody SystemLog log) {
        // Logic để lưu lại nhật ký hệ thống vào database
        return systemLogService.save(log);
    }
//    @GetMapping("/api/system-logs")
//    public List<SystemLog> getSystemLogs(
//            @RequestParam(required = false) String startDate,
//            @RequestParam(required = false) String endDate,
//            @RequestParam(required = false) Long userId,
//            @RequestParam(required = false) String action) {
//        // Logic để lấy và trả về danh sách nhật ký hệ thống
//    }

}