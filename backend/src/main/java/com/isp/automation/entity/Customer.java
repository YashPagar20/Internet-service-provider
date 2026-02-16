package com.isp.automation.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "customers")
@Data
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(unique = true, nullable = false)
    private String phone;

    private String address;

    @Enumerated(EnumType.STRING)
    private ConnectionStatus connectionStatus;

    // Will be linked to Plan entity later
    // @ManyToOne
    // @JoinColumn(name = "plan_id")
    // private Plan plan;

    @Column(name = "plan_id")
    private UUID planId;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum ConnectionStatus {
        ACTIVE, INACTIVE, SUSPENDED
    }
}
