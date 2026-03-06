package com.isp.automation.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public void setUsername(String admin) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public void setPassword(String encode) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public void setRole(Role role) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public enum Role {
        ADMIN, STAFF, CUSTOMER
    }
}
