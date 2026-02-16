package com.isp.automation.repository;

import com.isp.automation.entity.Plan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PlanRepository extends JpaRepository<Plan, UUID> {
    Optional<Plan> findByPlanName(String planName);
    boolean existsByPlanName(String planName);
}
