package com.isp.automation.service;

import com.isp.automation.entity.Bill;
import com.isp.automation.entity.Customer;
import com.isp.automation.entity.Plan;
import com.isp.automation.repository.BillRepository;
import com.isp.automation.repository.CustomerRepository;
import com.isp.automation.repository.PlanRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class BillService {

    private final BillRepository billRepository;
    private final CustomerRepository customerRepository;
    private final PlanRepository planRepository;

    @Transactional(readOnly = true)
    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Bill> getBillsByCustomerId(UUID customerId) {
        return billRepository.findByCustomerId(customerId);
    }

    /**
     * Scheduled job to generate bills for all ACTIVE customers.
     * Runs every month on the 1st day at 00:00.
     */
    @Scheduled(cron = "0 0 0 1 * ?")
    @Transactional
    public void generateMonthlyBills() {
        log.info("Starting monthly bill generation...");
        List<Customer> activeCustomers = customerRepository.findAll().stream()
                .filter(c -> c.getConnectionStatus() == Customer.ConnectionStatus.ACTIVE)
                .toList();

        for (Customer customer : activeCustomers) {
            try {
                if (customer.getPlanId() == null) continue;

                Optional<Plan> planOpt = planRepository.findById(customer.getPlanId());
                if (planOpt.isEmpty()) continue;

                Plan plan = planOpt.get();
                createBillForCustomer(customer, plan);
            } catch (Exception e) {
                log.error("Failed to generate bill for customer: {}", customer.getId(), e);
            }
        }
        log.info("Monthly bill generation completed.");
    }

    private void createBillForCustomer(Customer customer, Plan plan) {
        Bill bill = new Bill();
        bill.setCustomerId(customer.getId());
        bill.setAmount(plan.getPrice());
        bill.setDueDate(LocalDate.now().plusDays(15)); // 15 days to pay
        bill.setStatus(Bill.BillStatus.UNPAID);
        bill.setLateFee(BigDecimal.ZERO);
        billRepository.save(bill);
    }
    
    // Manual trigger for testing
    @Transactional
    public Bill generateBillManual(UUID customerId) {
        Customer customer = customerRepository.findById(customerId)
            .orElseThrow(() -> new IllegalArgumentException("Customer not found"));
            
        if (customer.getConnectionStatus() != Customer.ConnectionStatus.ACTIVE) {
            throw new IllegalArgumentException("Customer is not active");
        }
        
        if (customer.getPlanId() == null) {
             throw new IllegalArgumentException("Customer has no plan assigned");
        }

        Plan plan = planRepository.findById(customer.getPlanId())
            .orElseThrow(() -> new IllegalArgumentException("Plan not found"));
            
        Bill bill = new Bill();
        bill.setCustomerId(customer.getId());
        bill.setAmount(plan.getPrice());
        bill.setDueDate(LocalDate.now().plusDays(15));
        bill.setStatus(Bill.BillStatus.UNPAID);
        bill.setLateFee(BigDecimal.ZERO);
        return billRepository.save(bill);
    }
}
