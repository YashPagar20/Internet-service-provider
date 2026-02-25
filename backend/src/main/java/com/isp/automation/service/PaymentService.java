package com.isp.automation.service;

import com.isp.automation.entity.Bill;
import com.isp.automation.entity.Payment;
import com.isp.automation.repository.BillRepository;
import com.isp.automation.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BillRepository billRepository;
    private final NotificationService notificationService;

    @Transactional
    public Payment processPayment(Payment payment) {
        Bill bill = billRepository.findById(payment.getBillId())
                .orElseThrow(() -> new IllegalArgumentException("Bill not found"));

        if (bill.getStatus() == Bill.BillStatus.PAID) {
            throw new IllegalArgumentException("Bill is already paid");
        }

        // Simulate payment processing (mock success)
        payment.setStatus(Payment.PaymentStatus.SUCCESS);
        payment.setTransactionId(UUID.randomUUID().toString()); // Mock transaction ID

        Payment savedPayment = paymentRepository.save(payment);

        if (savedPayment.getStatus() == Payment.PaymentStatus.SUCCESS) {
            bill.setStatus(Bill.BillStatus.PAID);
            billRepository.save(bill);
            
            notificationService.sendPaymentSuccessNotification(bill.getCustomerId(), savedPayment.getTransactionId(), bill.getAmount().toString());
        }

        return savedPayment;
    }

    @Transactional(readOnly = true)
    public List<Payment> getPaymentsByBillId(UUID billId) {
        return paymentRepository.findByBillId(billId);
    }
}
