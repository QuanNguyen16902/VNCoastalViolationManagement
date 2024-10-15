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
    private String tokenSecret;
    private int tokenExpiry;

    // Mail Settings
    private String mailHost;
    private int mailPort;
    private String mailUsername;
    private String mailPassword;
    private String smtpAuth;
    private String smtpStartTls;
}
