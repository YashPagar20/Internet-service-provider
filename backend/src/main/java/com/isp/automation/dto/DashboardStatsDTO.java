package com.isp.automation.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class DashboardStatsDTO {
    private long totalCustomers;
    private long activePlans;
    private long pendingBills;
    private BigDecimal monthlyRevenue;
    private List<Map<String, Object>> revenueTrend;
    private List<Map<String, Object>> planDistribution;
}
