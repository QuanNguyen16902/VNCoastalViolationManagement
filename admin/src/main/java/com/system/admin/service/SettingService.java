package com.system.admin.service;

import com.system.admin.model.Setting;
import com.system.admin.model.SettingUpdateRequest;
import com.system.admin.repository.SettingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SettingService {
    @Autowired
    private SettingRepository settingRepository;

    public String getJwtSecret() {
        Setting config = settingRepository.findByKey("jwtSecret");
        return config != null ? config.getValue() : null;
    }

    public int getJwtExpirationMs() {
        Setting config = settingRepository.findByKey("jwtExpirationMs");
        return config != null ? Integer.parseInt(config.getValue()) : 0;
    }
    private void updateConfigValue(String key, String value) {
        Setting config = settingRepository.findByKey(key);
        if (config != null) {
            config.setValue(value);
            settingRepository.save(config);
        } else {
            // Nếu chưa tồn tại, bạn có thể thêm mới hoặc bỏ qua
            Setting newConfig = new Setting();
            newConfig.setKey(key);
            newConfig.setValue(value);
            settingRepository.save(newConfig);
        }
    }
    public void updateConfig(SettingUpdateRequest request) {
        updateConfigValue("tokenExpiry", String.valueOf(request.getTokenExpiry()));
        updateConfigValue("tokenSecret", request.getTokenSecret());

        updateConfigValue("mailHost", request.getMailHost());
        updateConfigValue("mailPort", String.valueOf(request.getMailPort()));
        updateConfigValue("mailUsername", request.getMailUsername());
        updateConfigValue("mailPassword", request.getMailPassword());
        updateConfigValue("smtpAuth", request.getSmtpAuth());
        updateConfigValue("smtpStartTls", request.getSmtpStartTls());
    }


    public SettingUpdateRequest getCurrentConfig() {
        SettingUpdateRequest config = new SettingUpdateRequest();
        config.setTokenExpiry(Integer.parseInt(settingRepository.findByKey("jwtExpirationMs").getValue()));
        config.setTokenSecret(settingRepository.findByKey("jwtSecret").getValue());

        config.setMailHost(settingRepository.findByKey("mailHost").getValue());
        config.setMailPort(Integer.parseInt(settingRepository.findByKey("mailPort").getValue()));
        config.setMailUsername(settingRepository.findByKey("mailUsername").getValue());
        config.setMailPassword(settingRepository.findByKey("mailPassword").getValue());
        config.setSmtpAuth(settingRepository.findByKey("smtpAuth").getValue());
        config.setSmtpStartTls(settingRepository.findByKey("smtpStartTls").getValue());


        return config;
    }
}
