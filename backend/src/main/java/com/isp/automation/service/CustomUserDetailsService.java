package com.isp.automation.service;

import com.isp.automation.entity.User;
import com.isp.automation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository repository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> userDetail = repository.findByUsername(username);

        // Converting userDetail to UserDetails
        return userDetail.map(CustomUserDetails::new)
                .orElseThrow(() -> new UsernameNotFoundException("User not found " + username));
    }
}
