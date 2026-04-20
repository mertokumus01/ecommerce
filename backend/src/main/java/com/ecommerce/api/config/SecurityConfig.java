package com.ecommerce.api.config;

import com.ecommerce.api.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Allow multiple origins for development (ng serve) and production (Docker)
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:4200",      // Angular dev server
            "http://localhost:3000",      // Alternative dev port
            "http://localhost:80",        // Docker frontend (explicit port)
            "http://localhost",           // Docker frontend (default port)
            "http://127.0.0.1:4200",      // Local testing
            "http://127.0.0.1:3000",      // Local testing
            "http://ecommerce-web",       // Docker container network name
            "https://localhost",          // HTTPS support
            "https://ecommerce.local"     // Production domain
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints - no authentication required
                        .requestMatchers(
                                "/user/save",
                                "/auth/**",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/actuator/**",
                                // Product browsing - public
                                "/products",
                                "/products/**",
                                // Category browsing - public
                                "/categories",
                                "/categories/**",
                                // Checkout options - public
                                "/cities",
                                "/cities/**",
                                "/shipping-methods",
                                "/shipping-methods/**",
                                "/payment-methods",
                                "/payment-methods/**",
                                // Reviews viewing - public
                                "/reviews/**"
                        ).permitAll()
                        // All other endpoints require authentication
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}

