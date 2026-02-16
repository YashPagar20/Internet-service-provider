package com.isp.automation.service;

import com.isp.automation.entity.Customer;
import com.isp.automation.repository.CustomerRepository;
import com.isp.automation.repository.PlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final PlanRepository planRepository;

    @Transactional(readOnly = true)
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Customer> getCustomerById(UUID id) {
        return customerRepository.findById(id);
    }

    @Transactional
    public Customer createCustomer(Customer customer) {
        if (customerRepository.existsByEmail(customer.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        if (customerRepository.existsByPhone(customer.getPhone())) {
            throw new IllegalArgumentException("Phone number already in use");
        }
        if (customer.getPlanId() != null && !planRepository.existsById(customer.getPlanId())) {
            throw new IllegalArgumentException("Invalid Plan ID");
        }
        // Default status
        if (customer.getConnectionStatus() == null) {
            customer.setConnectionStatus(Customer.ConnectionStatus.ACTIVE);
        }
        return customerRepository.save(customer);
    }

    @Transactional
    public Customer updateCustomer(UUID id, Customer customerDetails) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        customer.setName(customerDetails.getName());
        customer.setAddress(customerDetails.getAddress());
        customer.setConnectionStatus(customerDetails.getConnectionStatus());
        
        if (customerDetails.getPlanId() != null && !planRepository.existsById(customerDetails.getPlanId())) {
            throw new IllegalArgumentException("Invalid Plan ID");
        }
        customer.setPlanId(customerDetails.getPlanId());
        
        // Only update email/phone if changed and not taken (simplified check)
        if (!customer.getEmail().equals(customerDetails.getEmail()) && customerRepository.existsByEmail(customerDetails.getEmail())) {
             throw new IllegalArgumentException("Email already in use");
        }
        customer.setEmail(customerDetails.getEmail());

        if (!customer.getPhone().equals(customerDetails.getPhone()) && customerRepository.existsByPhone(customerDetails.getPhone())) {
             throw new IllegalArgumentException("Phone number already in use");
        }
        customer.setPhone(customerDetails.getPhone());

        return customerRepository.save(customer);
    }

    @Transactional
    public void deleteCustomer(UUID id) {
        if (!customerRepository.existsById(id)) {
            throw new IllegalArgumentException("Customer not found");
        }
        customerRepository.deleteById(id);
    }
}
