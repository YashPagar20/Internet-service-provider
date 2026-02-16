package com.isp.automation.controller;

import com.isp.automation.entity.Bill;
import com.isp.automation.service.BillService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/bills")
@RequiredArgsConstructor
public class BillController {

    private final BillService billService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
    public ResponseEntity<List<Bill>> getAllBills() {
        return ResponseEntity.ok(billService.getAllBills());
    }

    @GetMapping("/customer/{customerId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'CUSTOMER')")
    public ResponseEntity<List<Bill>> getBillsByCustomer(@PathVariable UUID customerId) {
        // TODO: Ensure CUSTOMER can only see their own bills
        return ResponseEntity.ok(billService.getBillsByCustomerId(customerId));
    }

    @PostMapping("/generate/{customerId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Bill> generateBill(@PathVariable UUID customerId) {
        return ResponseEntity.ok(billService.generateBillManual(customerId));
    }
}
