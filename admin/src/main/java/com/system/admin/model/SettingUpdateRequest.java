package com.system.admin.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SettingUpdateRequest {
    //General Setting
    private String siteName;
    private String subSiteName;
    private String footerText;
    private String logoUrl;
    private String websiteDescription;

    // Token Setting
    private String tokenSecret;
    private int tokenExpiry;

    // Mail Settings
    private String mailHost;
    private int mailPort;
    private String mailUsername;
    private String mailPassword;
    private String smtpAuth;
    private String smtpStartTls;

    // Mail Template
    private String mailViolationConfirmSubject;
    private String mailViolationConfirmContent;
}
