package com.isp.automation.config;

import com.isp.automation.entity.User;
import com.isp.automation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final com.isp.automation.repository.PlanRepository planRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedAdmin();
        seedPlans();
    }

    private void seedAdmin() {
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin"));
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);
            System.out.println("Default admin user created: admin / admin");
        }
    }

    private void seedPlans() {
        // Budget Plans
        createPlanIfMissing("Starter Plan", 30, 299, 28, "Data: 1 GB Per day, Voice: Unlimited Voice Calls", false);
        createPlanIfMissing("Standard Plan", 100, 199, 28, "Data: 1.5 GB Per day, Voice: Unlimited Voice Calls", true);
        
        // High Speed & Pro Plans
        createPlanIfMissing("Gamer Pro", 300, 999, 30, "Data: Unlimited (FUP 3.3TB), Voice: Unlimited, Low Latency for Gaming", true);
        createPlanIfMissing("Work From Home", 150, 749, 30, "Data: 5 GB Per day, Voice: Unlimited, Priority Support", false);
        createPlanIfMissing("Super Plan", 200, 598, 56, "Data: 2 GB Per day, Voice: Unlimited, Disney+Hotstar VIP Annual Subscription", true);
        
        // Long Validity Plans
        createPlanIfMissing("Long Validity", 100, 555, 84, "Data: 1.5 GB Per day, Voice: Unlimited Voice Calls", true);
        createPlanIfMissing("Ultimate Plan", 300, 599, 84, "Data: 2 GB Per day, Voice: Unlimited Voice Calls", false);
        createPlanIfMissing("Annual Value", 100, 4999, 365, "Data: 1.5 GB Per day, Voice: Unlimited, Free Router Installation", false);
        
        // Special Add-ons
        createPlanIfMissing("Data Add-on", 0, 11, 0, "DATA: 1 GB, VALIDITY: EXISTING PLAN FOR USERS WITH AN ACTIVE VALIDITY PLAN", true);
        
        // Specialized Plans
        createPlanIfMissing("OTT Bundle", 500, 1499, 30, "Premium Streaming: Includes Netflix, Prime Video, and Disney+ Hotstar", false);
        createPlanIfMissing("Smart Home", 200, 899, 30, "Optimized for IoT: Connect up to 50 devices with dedicated bandwidth", false);
        createPlanIfMissing("Student Special", 50, 499, 30, "Educational Focus: Unlimited access to learning portals at high speed", false);
        
        System.out.println("ISP plans synchronization complete.");
    }

    private void createPlanIfMissing(String name, int speed, int price, int validity, String desc, boolean popular) {
        if (planRepository.findByPlanName(name).isEmpty()) {
            createPlan(name, speed, price, validity, desc, popular);
            System.out.println("Plan seeded: " + name);
        }
    }

    private void createPlan(String name, int speed, int price, int validity, String desc, boolean popular) {
        com.isp.automation.entity.Plan plan = new com.isp.automation.entity.Plan();
        plan.setPlanName(name);
        plan.setSpeedMbps(speed);
        plan.setPrice(java.math.BigDecimal.valueOf(price));
        plan.setValidityDays(validity);
        plan.setDescription(desc);
        plan.setIsPopular(popular);
        planRepository.save(plan);
    }
}
