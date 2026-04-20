package com.ecommerce.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    
    private boolean success;
    private String token;
    private String message;
    private String userEmail;
    
    public AuthResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
}
