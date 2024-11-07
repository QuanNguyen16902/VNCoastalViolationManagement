package com.system.admin.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.system.admin.model.token.PasswordResetToken;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
//import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jdk.jfr.Name;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.OnDelete;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "username"),
                @UniqueConstraint(columnNames = "email"),
        })
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

//    @NotBlank
    @Size(max = 30)
    @Column(name = "username")
    private String username;


//    @NotBlank
    @Size(max = 50)
    @Column(name = "email")
    private String email;

//    @NotBlank
    @Size(max = 120)
    @Column(name = "password")
    private String password;



    private boolean enabled;

//    @OneToOne(cascade = CascadeType.ALL)
//    @JoinColumn(name = "photo_id", referencedColumnName = "id")

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "users_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Profile profile;
//
//    @PostPersist
//    public void createProfile() {
//        if (this.profile == null) {
//            Profile profile = new Profile();
//            profile.setUser(this);
//            profile.setId(this.id);
////            profile.setFullName(this.username); // Hoặc giá trị khác tùy ý
//            this.profile = profile;
//        }
//    }

    // Quan hệ OneToMany với PenaltyDecision
    @OneToMany(mappedBy = "nguoiThiHanh")
    @JsonIgnore
    private List<PenaltyDecision> penaltyDecisions = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<PasswordResetToken> passwordResetTokens = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<SystemLog> systemLogs = new HashSet<>();

//    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
//    @JsonIgnore
//    private Set<Setting> settings = new HashSet<>();

//    @Transient
//    private Set<String> rolesName;

    public User(String username, String email, String password, boolean enabled) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.enabled = enabled;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(id, user.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

}
