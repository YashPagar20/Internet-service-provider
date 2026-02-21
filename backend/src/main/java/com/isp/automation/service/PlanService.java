package com.isp.automation.service;

import com.isp.automation.entity.Plan;
import com.isp.automation.repository.PlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PlanService {

    private final PlanRepository planRepository;

    @Transactional(readOnly = true)
    public List<Plan> getAllPlans() {
        return planRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Plan getPlanById(UUID id) {
        return planRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Plan not found"));
    }

    @Transactional
    public Plan createPlan(Plan plan) {
        if (planRepository.existsByPlanName(plan.getPlanName())) {
            throw new IllegalArgumentException("Plan name already exists");
        }
        return planRepository.save(plan);
    }

    @Transactional
    public Plan updatePlan(UUID id, Plan planDetails) {
        Plan plan = getPlanById(id);

        if (!plan.getPlanName().equals(planDetails.getPlanName()) && 
            planRepository.existsByPlanName(planDetails.getPlanName())) {
            throw new IllegalArgumentException("Plan name already exists");
        }

        plan.setPlanName(planDetails.getPlanName());
        plan.setSpeedMbps(planDetails.getSpeedMbps());
        plan.setPrice(planDetails.getPrice());
        plan.setValidityDays(planDetails.getValidityDays());
        plan.setDescription(planDetails.getDescription());
        plan.setIsPopular(planDetails.getIsPopular());
        plan.setIsActive(planDetails.getIsActive());

        return planRepository.save(plan);
    }

    @Transactional
    public void deletePlan(UUID id) {
        if (!planRepository.existsById(id)) {
            throw new IllegalArgumentException("Plan not found");
        }
        // TODO: Check if any customer is using this plan before deleting
        planRepository.deleteById(id);
    }
}
