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
        if (planRepository.count() == 0) {
            createPlan("Standard Plan", 100, 199, 28, "Data: 1.5 GB Per day Voice: Unlimited Voice Calls", true);
            createPlan("Data Add-on", 0, 11, 0, "DATA: 1 GB VALIDITY: EXISTING PLAN FOR USERS WITH AN ACTIVE VALIDITY PLAN", true);
            createPlan("Super Plan", 200, 598, 56, "Data: 2 GB Per day Voice: Unlimited Voice Calls Disney+Hotstar VIP Annual Subscription", true);
            createPlan("Long Validity", 100, 555, 84, "Data: 1.5 GB Per day Voice: Unlimited Voice Calls", true);
            createPlan("Ultimate Plan", 300, 599, 84, "Data: 2 GB Per day Voice: Unlimited Voice Calls", false);
            System.out.println("Default ISP plans seeded.");
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
