package com.isp.automation.controller;

import com.isp.automation.entity.Payment;
import com.isp.automation.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'CUSTOMER')")
    public ResponseEntity<Payment> processPayment(@RequestBody Payment payment) {
        return ResponseEntity.ok(paymentService.processPayment(payment));
    }

    @GetMapping("/bill/{billId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'CUSTOMER')")
    public ResponseEntity<List<Payment>> getPaymentsByBill(@PathVariable UUID billId) {
        return ResponseEntity.ok(paymentService.getPaymentsByBillId(billId));
    }
}
