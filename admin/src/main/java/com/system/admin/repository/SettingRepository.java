package com.system.admin.repository;

import com.system.admin.model.Setting;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SettingRepository extends JpaRepository<Setting, Long> {
    Setting findByKey(String key);
}