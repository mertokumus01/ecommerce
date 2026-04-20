package com.ecommerce.api.controller.impl;

import com.ecommerce.api.controller.IAuthController;
import com.ecommerce.api.dto.request.LoginRequest;
import com.ecommerce.api.dto.request.UserRequest;
import com.ecommerce.api.dto.response.AuthResponse;
import com.ecommerce.api.security.AuthenticationService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthControllerImpl implements IAuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthControllerImpl.class);

    @Autowired
    private AuthenticationService authenticationService;

    @Override
    public ResponseEntity<AuthResponse> register(@Valid UserRequest userRequest) {
        logger.info("[AuthController] Kayıt işlemi başlıyor: {}", userRequest.getUserEmail());
        System.out.println("[AuthController] Kayıt isteği: " + userRequest.getUserEmail());
        
        AuthResponse response = authenticationService.register(userRequest);
        
        logger.info("[AuthController] Kayıt cevabı - Başarılı: {} - Mesaj: {}", response.isSuccess(), response.getMessage());
        System.out.println("[AuthController] Kayıt yanıtı - Başarılı: " + response.isSuccess());
        
        if (response.isSuccess()) {
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @Override
    public ResponseEntity<AuthResponse> login(@Valid LoginRequest loginRequest) {
        try {
            logger.info("[AuthController] Giriş işlemi başlıyor: {}", loginRequest.getLoginEmail());
            System.out.println("[AuthController] Giriş isteği: " + loginRequest.getLoginEmail());
            
            AuthResponse response = authenticationService.login(loginRequest);
            
            logger.info("[AuthController] Giriş cevabı - Token var: {} - Mesaj: {}", response.getToken() != null, response.getMessage());
            System.out.println("[AuthController] Giriş yanıtı - Token var: " + (response.getToken() != null));
            
            if (response.isSuccess()) {
                return new ResponseEntity<>(response, HttpStatus.OK);
            }
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            logger.error("[AuthController] Login sırasında hata: {}", e.getMessage(), e);
            System.err.println("[AuthController] Login hatası: " + e.getMessage());
            e.printStackTrace();
            
            AuthResponse errorResponse = new AuthResponse();
            errorResponse.setSuccess(false);
            errorResponse.setMessage("Login failed: " + e.getMessage());
            
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<AuthResponse> validateToken(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        boolean isValid = authenticationService.validateToken(token);
        if (isValid) {
            String userEmail = authenticationService.getUserEmailFromToken(token);
            AuthResponse response = new AuthResponse();
            response.setSuccess(true);
            response.setUserEmail(userEmail);
            response.setMessage("Token is valid");
            return new ResponseEntity<>(response, HttpStatus.OK);
        }

        return new ResponseEntity<>(new AuthResponse(false, "Invalid token"), HttpStatus.UNAUTHORIZED);
    }
}
