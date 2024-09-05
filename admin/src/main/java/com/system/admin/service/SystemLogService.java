package com.system.admin.service;

import com.system.admin.model.SystemLog;
import com.system.admin.repository.SystemLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SystemLogService {

    @Autowired
    private SystemLogRepository systemLogRepository;

    public SystemLog save(SystemLog systemLog) {
        return systemLogRepository.save(systemLog);
    }

    public List<SystemLog> getAllLogs() {
        return systemLogRepository.findAll();
    }

    public List<SystemLog> getLogsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return systemLogRepository.findAllByTimestampBetween(startDate, endDate);
    }
}
