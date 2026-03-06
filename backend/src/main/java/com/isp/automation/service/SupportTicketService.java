package com.isp.automation.service;

import com.isp.automation.entity.SupportTicket;
import com.isp.automation.repository.SupportTicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SupportTicketService {

    private final SupportTicketRepository supportTicketRepository;
    private final NotificationService notificationService;

    @Transactional
    public SupportTicket createTicket(SupportTicket ticket) {
        SupportTicket savedTicket = supportTicketRepository.save(ticket);
        notificationService.sendTicketConfirmation(savedTicket.getCustomerId(), savedTicket.getId().toString(), savedTicket.getSubject());
        return savedTicket;
    }

    @Transactional(readOnly = true)
    public List<SupportTicket> getTicketsByCustomer(UUID customerId) {
        return supportTicketRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

    @Transactional
    public SupportTicket updateStatus(UUID ticketId, SupportTicket.TicketStatus status) {
        SupportTicket ticket = supportTicketRepository.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found"));
        ticket.setStatus(status);
        SupportTicket updatedTicket = supportTicketRepository.save(ticket);
        notificationService.sendTicketStatusUpdate(updatedTicket.getCustomerId(), updatedTicket.getId().toString(), status.toString());
        return updatedTicket;
    }
}
