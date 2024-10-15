package com.system.admin.security.auth_service;

import com.system.admin.model.Permission;
import com.system.admin.model.Role;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.util.Assert;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.util.Assert;

import java.util.Objects;


public final class CustomGrantedAuthority implements GrantedAuthority {
    private static final long serialVersionUID = 620L;
//    private final Permission permission;
    private final Role role;

    public CustomGrantedAuthority(Role role) {
//        Assert.hasText(permission.getName(), "A granted authority textual representation is required");
        Assert.notNull(role, "A role is required");
//        this.permission = permission;
        this.role = role;
    }

    @Override
    public String getAuthority() {
        // Return a combined string of role and permission, or just the permission if required
        return "ROLE_" + role.getName();
    }

    public Role getRole() {
        return this.role;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }

        if (obj instanceof CustomGrantedAuthority) {
            CustomGrantedAuthority other = (CustomGrantedAuthority) obj;
            // Compare both role and permission
            return
                    Objects.equals(this.role, other.role);
        }

        return false;
    }

    @Override
    public int hashCode() {
        // Use both role and permission in hashCode calculation
        return Objects.hash( this.role);
    }

    @Override
    public String toString() {
        // Return a meaningful string with role and permission
        return String.format("Role: %s", role.getName());
    }
}
