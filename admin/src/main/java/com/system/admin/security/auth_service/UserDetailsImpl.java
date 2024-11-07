package com.system.admin.security.auth_service;

import com.system.admin.model.Permission;
import com.system.admin.model.Role;
import com.system.admin.model.User;
import net.minidev.json.annotate.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;
import java.util.stream.Collectors;


public class UserDetailsImpl implements UserDetails {
    private static final Long serialVersionUID = 1L;
    private Long id;

    private String username;
    private String email;

    @JsonIgnore
    private String password;

    private boolean enabled;

    private Collection<? extends GrantedAuthority> roles;
    private Collection<? extends GrantedAuthority> permissions;

    public UserDetailsImpl(Long id, String username, String email, String password, boolean enabled,
                           Collection<? extends GrantedAuthority> roles,
                           Collection<? extends GrantedAuthority> permissions) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.enabled = enabled;
        this.roles = roles;
        this.permissions = permissions;
    }

    public static UserDetailsImpl build(User user) {

        // Tách roles và permissions thành hai danh sách riêng biệt
        Set<GrantedAuthority> roles = new HashSet<>();
        Set<GrantedAuthority> permissions = new HashSet<>();

        // Thêm roles của người dùng vào danh sách roles
        for (Role role : user.getRoles()) {
            roles.add(new SimpleGrantedAuthority("ROLE_" + role.getName()));

            // Thêm permissions từ roles vào danh sách permissions
            for (Permission permission : role.getPermissions()) {
                permissions.add(new SimpleGrantedAuthority(permission.getName()));
            }
        }

        return new UserDetailsImpl(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getPassword(),
                user.isEnabled(),
                roles,        // Roles được tách riêng
                permissions   // Permissions được tách riêng
        );
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Hợp nhất cả roles và permissions vào một tập hợp khi cần cho Spring Security
        Set<GrantedAuthority> combinedAuthorities = new HashSet<>();
        combinedAuthorities.addAll(roles);
        combinedAuthorities.addAll(permissions);
        // Trả về roles và permissions trong cùng một tập hợp
        return combinedAuthorities;
    }
    public Collection<? extends GrantedAuthority> getRoles() {
        return roles;
    }

    // Trả về permissions riêng biệt
    public Collection<? extends GrantedAuthority> getPermissions() {
        return permissions;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        UserDetailsImpl user = (UserDetailsImpl) o;
        return Objects.equals(id, user.id);
    }
}
