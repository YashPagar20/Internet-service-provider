package com.isp.automation.controller;

import com.isp.automation.dto.AuthRequest;
import com.isp.automation.dto.AuthResponse;
import com.isp.automation.entity.User;
import com.isp.automation.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService service;

    @PostMapping("/register")
    public String addNewUser(@RequestBody User user) {
        return service.saveUser(user);
    }

    @PostMapping("/login")
    public AuthResponse getToken(@RequestBody AuthRequest authRequest) {
        return service.generateToken(authRequest.getUsername(), authRequest.getPassword());
    }
}
