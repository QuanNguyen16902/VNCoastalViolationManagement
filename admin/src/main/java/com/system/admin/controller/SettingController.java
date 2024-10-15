package com.system.admin.controller;

import com.system.admin.model.SettingUpdateRequest;
import com.system.admin.service.SettingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("${API_URL}/settings")
public class SettingController {
    @Autowired
    private SettingService configService;

    @PutMapping("/jwt-config")
    public ResponseEntity<?> updateJwtConfig(@RequestBody SettingUpdateRequest request) {
        configService.updateConfig(request);
        return ResponseEntity.ok("Configuration updated successfully");
    }
    // GET cấu hình
    @GetMapping("/jwt-config")
    public ResponseEntity<SettingUpdateRequest> getJwtConfig() {

        SettingUpdateRequest config = configService.getCurrentConfig();
        return ResponseEntity.ok(config);
    }

}
