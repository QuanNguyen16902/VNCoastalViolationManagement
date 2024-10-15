package com.system.admin.security.auth_service;

import com.system.admin.config.MailConfig;
import com.system.admin.config.MailConfigService;
import com.system.admin.model.SettingUpdateRequest;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.util.Properties;
import java.util.Random;

@Service
public class EmailService {

    @Autowired
    public MailConfigService mailConfigService;

    private final JavaMailSender mailSender;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }


    public void sendEmail(String to, String subject, String content) throws MessagingException {
//        MailConfig emailSettings = mailConfigService.getMailConfig();

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "UTF-8");
        try {
            helper.setFrom("quannguyen16902hn@gmail.com");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, true); // true indicates HTML
            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    public String generateVerificationCode() {
        Random random = new Random();
        // Tạo mã 6 ký tự
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }
}
