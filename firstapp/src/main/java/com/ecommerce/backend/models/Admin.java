package com.ecommerce.backend.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "admins",
       indexes = {
           @Index(name = "idx_username", columnList = "username"),
           @Index(name = "idx_email", columnList = "email")
       })
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100, unique = true)
    private String username;

    @Column(nullable = false, length = 255, unique = true)
    private String email;

    @Column(nullable = false, length = 255)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // ===== Getters and Setters =====
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        // ✅ Hash password automatically when setting
        if (password != null && !password.startsWith("$2a$")) {
            this.password = org.springframework.security.crypto.bcrypt.BCrypt
                                .hashpw(password, org.springframework.security.crypto.bcrypt.BCrypt.gensalt());
        } else {
            this.password = password;
        }
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
