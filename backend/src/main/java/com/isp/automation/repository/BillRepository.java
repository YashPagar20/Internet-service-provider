package com.isp.automation.repository;

import com.isp.automation.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BillRepository extends JpaRepository<Bill, UUID> {
    List<Bill> findByCustomerId(UUID customerId);
    List<Bill> findByStatus(Bill.BillStatus status);
}
