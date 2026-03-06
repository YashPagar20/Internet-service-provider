package com.isp.automation.scheduler;

import com.isp.automation.entity.Customer;
import com.isp.automation.repository.CustomerRepository;
import com.isp.automation.service.BillService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class BillingScheduler {

    private final CustomerRepository customerRepository;
    private final BillService billService;

    // Runs every day at midnight
    @Scheduled(cron = "0 0 0 * * *")
    public void generateMonthlyBills() {
        log.info("BILLING SCHEDULER: Starting automated bill generation...");
        List<Customer> customers = customerRepository.findAll();
        
        for (Customer customer : customers) {
            try {
                // Here logic could be added to check if bill is already generated for current month
                billService.generateBillManual(customer.getId());
                log.info("AUTOMATED BILLING: Generated bill for customer {}", customer.getId());
            } catch (Exception e) {
                log.error("AUTOMATED BILLING ERROR: Failed for customer {}: {}", customer.getId(), e.getMessage());
            }
        }
    }
}
