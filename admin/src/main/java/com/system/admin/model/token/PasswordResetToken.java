package com.system.admin.model.token;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
@Getter
@Setter
@Entity
public class PasswordResetToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String token;

    @Column(nullable = false)
    private String verificationCode;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private Date expiryDate;

    // Getters and Setters
}
