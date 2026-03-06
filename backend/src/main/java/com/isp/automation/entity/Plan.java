package com.isp.automation.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "plans")
@Data
public class Plan {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String planName;

    @Column(nullable = false)
    private Integer speedMbps;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer validityDays;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Boolean isPopular = false;

    @Column(nullable = false)
    private Boolean isActive = true;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public void setPlanName(String name) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public void setSpeedMbps(int speed) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public void setPrice(BigDecimal valueOf) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public void setValidityDays(int validity) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public void setIsPopular(boolean popular) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public void setDescription(String desc) {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}
