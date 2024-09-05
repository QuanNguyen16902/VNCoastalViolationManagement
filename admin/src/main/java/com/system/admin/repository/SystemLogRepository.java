package com.system.admin.repository;

import com.system.admin.model.SystemLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface SystemLogRepository extends JpaRepository<SystemLog, Long> {
    List<SystemLog> findAllByTimestampBetween(LocalDateTime startDate, LocalDateTime endDate);

}
