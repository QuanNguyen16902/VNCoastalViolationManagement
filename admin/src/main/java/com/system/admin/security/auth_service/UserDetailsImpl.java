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
    private Collection<? extends GrantedAuthority> rolesOfGroup;

    public UserDetailsImpl(Long id, String username, String email, String password, boolean enabled,
                           Collection<? extends GrantedAuthority> roles,
                           Collection<? extends GrantedAuthority> permissions,
                           Collection<? extends GrantedAuthority> rolesOfGroup) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.enabled = enabled;
        this.roles = roles;
        this.permissions = permissions;
        this.rolesOfGroup = rolesOfGroup;
    }

    public static UserDetailsImpl build(User user) {

        // Tách roles và permissions thành hai danh sách riêng biệt
        Set<GrantedAuthority> roles = new HashSet<>();
        Set<GrantedAuthority> permissions = new HashSet<>();
        Set<GrantedAuthority> rolesOfGroup = new HashSet<>();

        // Thêm roles của người dùng vào danh sách roles
        for (Role role : user.getRoles()) {
            roles.add(new SimpleGrantedAuthority("ROLE_" + role.getName()));

            // Thêm permissions từ roles vào danh sách permissions
            for (Permission permission : role.getPermissions()) {
                permissions.add(new SimpleGrantedAuthority(permission.getName()));
            }
        }

        // Lấy quyền từ các nhóm người dùng tham gia và thêm vào quyền của người dùng
        user.getGroups().forEach(group -> {
            rolesOfGroup.addAll(group.getRoles().stream()
                    .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
                    .collect(Collectors.toSet()));

            // Lấy quyền từ các vai trò trong nhóm và thêm vào permissions
            group.getRoles().forEach(groupRole -> {
                groupRole.getPermissions().forEach(permission -> {
                    permissions.add(new SimpleGrantedAuthority(permission.getName()));
                });
            });
        });

        // Trả về UserDetailsImpl với các quyền từ roles, permissions và roles của nhóm
        return new UserDetailsImpl(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getPassword(),
                user.isEnabled(),
                roles,        // Roles được tách riêng
                permissions,  // Permissions được tách riêng
                rolesOfGroup  // Roles từ nhóm
        );
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Hợp nhất cả roles và permissions vào một tập hợp khi cần cho Spring Security
        Set<GrantedAuthority> combinedAuthorities = new HashSet<>();
        combinedAuthorities.addAll(roles);
        combinedAuthorities.addAll(permissions);
        combinedAuthorities.addAll(rolesOfGroup);
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
    public Collection<? extends GrantedAuthority> getRolesOfGroup() {
        return rolesOfGroup;
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
