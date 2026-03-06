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

    public void sendTicketConfirmation(UUID customerId, String ticketId, String subject) {
        log.info("NOTIFICATION: Ticket #{} received from customer {}. Subject: {}", ticketId, customerId, subject);
        log.info("EMAIL MOCK: 'Dear Customer, we have received your ticket regarding {}. Our team is on it!' sent to customer email.", subject);
    }

    public void sendTicketStatusUpdate(UUID customerId, String ticketId, String status) {
        log.info("NOTIFICATION: Ticket #{} status updated to {} for customer {}", ticketId, status, customerId);
        log.info("SMS MOCK: 'Hi! Your support ticket #{} status is now {}.' sent to customer phone.", ticketId, status);
    }
}
