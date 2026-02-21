package com.isp.automation.service;

import com.isp.automation.dto.AuthRequest;
import com.isp.automation.dto.AuthResponse;
import com.isp.automation.entity.User;
import com.isp.automation.repository.UserRepository;
import com.isp.automation.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    public String saveUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        repository.save(user);
        return "User added to system";
    }

    public AuthResponse generateToken(String username, String password) {
        try {
            System.out.println("Login attempt for user: " + username);
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
            System.out.println("Authentication successful for user: " + username);
            String token = jwtUtil.generateToken(username);
            return new AuthResponse(token);
        } catch (Exception e) {
            System.err.println("Authentication failed for user: " + username + " - " + e.getMessage());
            throw e;
        }
    }
}
