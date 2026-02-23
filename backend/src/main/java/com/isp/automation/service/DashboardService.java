package com.isp.automation.service;

import com.isp.automation.dto.DashboardStatsDTO;
import com.isp.automation.entity.Bill;
import com.isp.automation.repository.BillRepository;
import com.isp.automation.repository.CustomerRepository;
import com.isp.automation.repository.PlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.Month;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final CustomerRepository customerRepository;
    private final PlanRepository planRepository;
    private final BillRepository billRepository;

    public DashboardStatsDTO getStats() {
        long totalCustomers = customerRepository.count();
        long activePlans = planRepository.count();
        long pendingBills = billRepository.findByStatus(Bill.BillStatus.UNPAID).size();

        // Calculate Monthly Revenue (Sum of PAID bills for current month)
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        BigDecimal monthlyRevenue = billRepository.findAll().stream()
                .filter(b -> b.getStatus() == Bill.BillStatus.PAID)
                .filter(b -> b.getGeneratedDate() != null && b.getGeneratedDate().isAfter(startOfMonth))
                .map(Bill::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return DashboardStatsDTO.builder()
                .totalCustomers(totalCustomers)
                .activePlans(activePlans)
                .pendingBills(pendingBills)
                .monthlyRevenue(monthlyRevenue)
                .revenueTrend(getRevenueTrend())
                .planDistribution(getPlanDistribution())
                .build();
    }

    private List<Map<String, Object>> getRevenueTrend() {
        List<Map<String, Object>> trend = new ArrayList<>();
        // Mocking trend data for now based on current year months
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
        Random random = new Random();
        for (String month : months) {
            Map<String, Object> data = new HashMap<>();
            data.put("name", month);
            data.put("revenue", 5000 + random.nextInt(10000));
            trend.add(data);
        }
        return trend;
    }

    private List<Map<String, Object>> getPlanDistribution() {
        List<Map<String, Object>> dist = new ArrayList<>();
        planRepository.findAll().forEach(plan -> {
            Map<String, Object> data = new HashMap<>();
            data.put("name", plan.getPlanName());
            data.put("value", 10 + new Random().nextInt(50)); // Mocking customer count per plan
            dist.add(data);
        });
        return dist;
    }
}
