package com.isp.automation.controller;

import com.isp.automation.entity.SupportTicket;
import com.isp.automation.service.SupportTicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class SupportTicketController {

    private final SupportTicketService supportTicketService;

    @PostMapping
    public ResponseEntity<SupportTicket> createTicket(@RequestBody SupportTicket ticket) {
        return ResponseEntity.ok(supportTicketService.createTicket(ticket));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<SupportTicket>> getCustomerTickets(@PathVariable UUID customerId) {
        return ResponseEntity.ok(supportTicketService.getTicketsByCustomer(customerId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<SupportTicket> updateStatus(
            @PathVariable UUID id,
            @RequestParam SupportTicket.TicketStatus status) {
        return ResponseEntity.ok(supportTicketService.updateStatus(id, status));
    }
}
