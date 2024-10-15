package com.system.admin.config;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MailConfig {
    private String mailHost;
    private int mailPort;
    private String mailUsername;
    private String mailPassword;
    private boolean smtpAuth;
    private boolean smtpStartTls;
    private boolean mailFrom;
    private String fromAddress;
    private String senderName;

}
