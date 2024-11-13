package com.system.admin.payload.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class JwtResponse {
    private String accessToken;
    private String type = "Bearer";
    private String refreshToken;
    private Long id;
    private String username;
    private String email;
    private List<String> roles;
    private List<String> permissions;
    private List<String> rolesOfGroup;

    public JwtResponse(String accessToken, String refreshToken, Long id, String username, String email, List<String> roles, List<String> permissions , List<String> rolesOfGroup ) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles;
        this.permissions = permissions;
        this.rolesOfGroup =rolesOfGroup;
    }

}