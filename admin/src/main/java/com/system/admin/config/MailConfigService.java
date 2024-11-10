package com.system.admin.config;

import com.system.admin.model.Setting;
import com.system.admin.repository.SettingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Service;

import java.util.Properties;

@Service
public class MailConfigService {

    @Autowired
    private SettingRepository appConfigRepository;
    // Retrieve current mail configuration
    public MailConfig getMailConfig() {
        MailConfig config = new MailConfig();
        Setting mailHost = appConfigRepository.findByKey("mailHost");
        Setting mailPort = appConfigRepository.findByKey("mailPort");
        Setting mailUsername = appConfigRepository.findByKey("mailUsername");
        Setting mailPassword = appConfigRepository.findByKey("mailPassword");
        Setting smtpAuth = appConfigRepository.findByKey("smtpAuth");
        Setting smtpStartTls = appConfigRepository.findByKey("smtpStartTls");
        Setting fromAddress = appConfigRepository.findByKey("fromAddress");
        Setting senderName = appConfigRepository.findByKey("senderName");

        if (mailHost != null) config.setMailHost(mailHost.getValue());
        if (mailPort != null) config.setMailPort(Integer.parseInt(mailPort.getValue()));
        if (mailUsername != null) config.setMailUsername(mailUsername.getValue());
        if (mailPassword != null) config.setMailPassword(mailPassword.getValue());
        if (smtpAuth != null) config.setSmtpAuth(Boolean.parseBoolean(smtpAuth.getValue()));
        if (smtpStartTls != null) config.setSmtpStartTls(Boolean.parseBoolean(smtpStartTls.getValue()));
        if (fromAddress != null) config.setFromAddress(fromAddress.getValue());
        if (senderName != null) config.setSenderName(senderName.getValue());

        return config;
    }

}
