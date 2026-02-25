package com.isp.automation.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Slf4j
public class NotificationService {

    public void sendBillNotification(UUID customerId, String billId, String amount) {
        log.info("NOTIFICATION: Sent bill notification to customer {} for bill {}. Amount: {}", customerId, billId, amount);
        // Extended logic for real Email/SMS goes here
    }

    public void sendPaymentSuccessNotification(UUID customerId, String transactionId, String amount) {
        log.info("NOTIFICATION: Payment successful for customer {}. Transaction ID: {}. Amount: {}", customerId, transactionId, amount);
    }

    public void sendOverdueReminder(UUID customerId, String billId, String amount) {
        log.info("NOTIFICATION: Overdue reminder sent to customer {} for bill {}. Amount: {}", customerId, billId, amount);
    }
}
