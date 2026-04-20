package com.ecommerce.api.security;

import com.ecommerce.api.dto.request.LoginRequest;
import com.ecommerce.api.dto.request.UserRequest;
import com.ecommerce.api.dto.response.AuthResponse;
import com.ecommerce.api.entity.User;
import com.ecommerce.api.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthenticationService {
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Register a new user
     */
    public AuthResponse register(UserRequest userRequest) {
        logger.info("[AuthService] Kayıt işlemi başladı: {}", userRequest.getUserEmail());
        System.out.println("[AuthService] Kayıt isteği: " + userRequest.getUserEmail());
        
        Optional<User> existingUser = userRepository.findAll()
                .stream()
                .filter(u -> u.getUserEmail().equals(userRequest.getUserEmail()))
                .findFirst();

        if (existingUser.isPresent()) {
            logger.warn("[AuthService] Kullanıcı zaten var: {}", userRequest.getUserEmail());
            System.out.println("[AuthService] Kullanıcı zaten mevcut: " + userRequest.getUserEmail());
            return new AuthResponse(false, "User already exists with this email");
        }

        logger.info("[AuthService] Yeni kullanıcı oluşturuluyor: {}", userRequest.getUserEmail());
        User user = new User();
        user.setUserEmail(userRequest.getUserEmail());
        user.setUserPassword(passwordEncoder.encode(userRequest.getUserPassword()));
        user.setUserFullName(userRequest.getUserFullName());
        user.setUserPhoneNumber(userRequest.getUserPhoneNumber());
        user.setUserRole("USER");

        User savedUser = userRepository.save(user);
        logger.info("[AuthService] Kullanıcı veritabanına kaydedildi: {} ID: {}", savedUser.getUserEmail(), savedUser.getUserId());
        System.out.println("[AuthService] Kullanıcı DB'ye kaydedildi: " + savedUser.getUserEmail() + " ID: " + savedUser.getUserId());
        
        String token = jwtTokenProvider.generateToken(user.getUserEmail());
        logger.info("[AuthService] Token oluşturuldu: {}", user.getUserEmail());
        
        AuthResponse response = new AuthResponse();
        response.setSuccess(true);
        response.setToken(token);
        response.setUserEmail(user.getUserEmail());
        response.setMessage("User registered successfully");
        
        logger.info("[AuthService] Kayıt başarılı: {}", user.getUserEmail());
        System.out.println("[AuthService] Kayıt başarılı: " + user.getUserEmail());
        return response;
    }

    /**
     * Authenticate user and generate token
     */
    public AuthResponse login(LoginRequest loginRequest) {
        try {
            logger.info("[AuthService] Giriş işlemi başladı: {}", loginRequest.getLoginEmail());
            System.out.println("[AuthService] Giriş isteği: " + loginRequest.getLoginEmail());
            
            Optional<User> user = userRepository.findAll()
                    .stream()
                    .filter(u -> u.getUserEmail().equals(loginRequest.getLoginEmail()))
                    .findFirst();

            if (user.isEmpty()) {
                logger.warn("[AuthService] Kullanıcı bulunamadı: {}", loginRequest.getLoginEmail());
                System.out.println("[AuthService] Kullanıcı bulunamadı: " + loginRequest.getLoginEmail());
                return new AuthResponse(false, "Invalid email or password");
            }

            logger.info("[AuthService] Kullanıcı bulundu: {}", loginRequest.getLoginEmail());
            System.out.println("[AuthService] Kullanıcı bulundu: " + loginRequest.getLoginEmail());

            try {
                if (!passwordEncoder.matches(loginRequest.getLoginPassword(), user.get().getUserPassword())) {
                    logger.warn("[AuthService] Şifre yanlış: {}", loginRequest.getLoginEmail());
                    System.out.println("[AuthService] Şifre yanlış: " + loginRequest.getLoginEmail());
                    return new AuthResponse(false, "Invalid email or password");
                }
            } catch (IllegalArgumentException ex) {
                logger.warn("[AuthService] Geçersiz şifre formatı: {}", loginRequest.getLoginEmail());
                return new AuthResponse(false, "Invalid email or password");
            }

            logger.info("[AuthService] Şifre doğru, token oluşturuluyor: {}", loginRequest.getLoginEmail());
            String token = jwtTokenProvider.generateToken(user.get().getUserEmail());
            
            AuthResponse response = new AuthResponse();
            response.setSuccess(true);
            response.setToken(token);
            response.setUserEmail(user.get().getUserEmail());
            response.setMessage("Login successful");
            
            logger.info("[AuthService] Giriş başarılı: {}", user.get().getUserEmail());
            System.out.println("[AuthService] Giriş başarılı: " + user.get().getUserEmail());
            return response;
        } catch (Exception e) {
            logger.error("[AuthService] Login sırasında hata: {}", e.getMessage(), e);
            System.err.println("[AuthService] Login hatası: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Login process failed: " + e.getMessage(), e);
        }
    }

    /**
     * Validate token
     */
    public boolean validateToken(String token) {
        return jwtTokenProvider.validateToken(token);
    }

    /**
     * Get user email from token
     */
    public String getUserEmailFromToken(String token) {
        return jwtTokenProvider.getUserEmailFromToken(token);
    }
}
