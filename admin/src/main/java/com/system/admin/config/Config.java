package com.system.admin.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class Config {
    @Bean
    public JavaMailSender javaMailSender(MailConfigService mailConfigService) {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();

        // You may want to obtain the configuration from your MailConfigService
        MailConfig config = mailConfigService.getMailConfig();

        mailSender.setHost(config.getMailHost());
        mailSender.setPort(config.getMailPort());
        mailSender.setUsername(config.getMailUsername());
        mailSender.setPassword(config.getMailPassword());

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.smtp.auth", config.isSmtpAuth());
        props.put("mail.smtp.starttls.enable", config.isSmtpStartTls());
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.debug", "false");
        // Set to true for debugging

        return mailSender;
    }
}
