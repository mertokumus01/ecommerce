package com.ecommerce.api.controller;

import com.ecommerce.api.dto.request.LoginRequest;
import com.ecommerce.api.dto.request.UserRequest;
import com.ecommerce.api.dto.response.AuthResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/auth")
public interface IAuthController {
    
    @PostMapping("/register")
    ResponseEntity<AuthResponse> register(@RequestBody UserRequest userRequest);
    
    @PostMapping("/login")
    ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest);
    
    @GetMapping("/validate")
    ResponseEntity<AuthResponse> validateToken(@RequestHeader("Authorization") String token);
}
