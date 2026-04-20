package com.ecommerce.api.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

@Component
public class JwtTokenProvider {

    @Value("${app.jwtSecret:ecommerceSecretKeyForJWTTokenGenerationAndValidation2024}")
    private String jwtSecret;

    @Value("${app.jwtExpirationMs:86400000}") // 24 hours
    private int jwtExpirationMs;

    /**
     * Generate JWT token for user
     */
    public String generateToken(String userEmail) {
        long now = System.currentTimeMillis();
        long expirationTime = now + jwtExpirationMs;

        // Simple JWT-like structure (In production, use proper JWT library like JJWT)
        String payload = userEmail + ":" + now + ":" + expirationTime;
        String encoded = Base64.getEncoder().encodeToString(payload.getBytes(StandardCharsets.UTF_8));
        String signature = generateSignature(payload);
        
        return encoded + "." + signature;
    }

    /**
     * Validate JWT token
     */
    public boolean validateToken(String token) {
        try {
            if (token == null || !token.contains(".")) {
                return false;
            }

            String[] parts = token.split("\\.");
            if (parts.length != 2) {
                return false;
            }

            String encoded = parts[0];
            String signature = parts[1];

            String payload = new String(Base64.getDecoder().decode(encoded), StandardCharsets.UTF_8);
            String expectedSignature = generateSignature(payload);

            if (!signature.equals(expectedSignature)) {
                return false;
            }

            String[] payloadParts = payload.split(":");
            if (payloadParts.length != 3) {
                return false;
            }

            long expirationTime = Long.parseLong(payloadParts[2]);
            return System.currentTimeMillis() < expirationTime;

        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Get user email from token
     */
    public String getUserEmailFromToken(String token) {
        try {
            String encoded = token.split("\\.")[0];
            String payload = new String(Base64.getDecoder().decode(encoded), StandardCharsets.UTF_8);
            return payload.split(":")[0];
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Generate signature using SHA-256 hash
     */
    private String generateSignature(String payload) {
        try {
            String signatureInput = payload + jwtSecret;
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(signatureInput.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not found", e);
        }
    }
}
