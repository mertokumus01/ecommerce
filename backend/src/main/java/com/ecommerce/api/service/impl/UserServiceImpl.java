package com.ecommerce.api.service.impl;

import com.ecommerce.api.dto.request.UserRequest;
import com.ecommerce.api.dto.request.UserUpdateRequest;
import com.ecommerce.api.dto.response.UserResponse;
import com.ecommerce.api.entity.User;
import com.ecommerce.api.repository.UserRepository;
import com.ecommerce.api.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements IUserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserResponse saveUser(UserRequest userRequest) {
        User user = new User();
        user.setUserEmail(userRequest.getUserEmail());
        user.setUserPassword(passwordEncoder.encode(userRequest.getUserPassword()));
        user.setUserFullName(userRequest.getUserFullName());
        user.setUserPhoneNumber(userRequest.getUserPhoneNumber());
        
        if (userRequest.getUserRole() != null && !userRequest.getUserRole().isBlank()) {
            user.setUserRole(userRequest.getUserRole().toUpperCase());
        } else {
            user.setUserRole("USER");
        }

        User savedUser = userRepository.save(user);
        return mapToResponse(savedUser);
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
        return mapToResponse(user);
    }

    @Override
    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        return mapToResponse(user);
    }

    @Override
    public UserResponse updateUser(Long id, UserUpdateRequest userRequest) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));

        if (userRequest.getUserEmail() != null && !userRequest.getUserEmail().isBlank()) {
            user.setUserEmail(userRequest.getUserEmail());
        }
        if (userRequest.getUserFullName() != null && !userRequest.getUserFullName().isBlank()) {
            user.setUserFullName(userRequest.getUserFullName());
        }
        if (userRequest.getUserPhoneNumber() != null) {
            user.setUserPhoneNumber(userRequest.getUserPhoneNumber());
        }
        if (userRequest.getUserRole() != null && !userRequest.getUserRole().isBlank()) {
            user.setUserRole(userRequest.getUserRole().toUpperCase());
        }
        if (userRequest.getUserPassword() != null && !userRequest.getUserPassword().isBlank()) {
            user.setUserPassword(passwordEncoder.encode(userRequest.getUserPassword()));
        }

        User updatedUser = userRepository.save(user);
        return mapToResponse(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with ID: " + id);
        }
        userRepository.deleteById(id);
    }

    private UserResponse mapToResponse(User user) {
        UserResponse response = new UserResponse();
        response.setUserId(user.getUserId());
        response.setUserEmail(user.getUserEmail());
        response.setUserFullName(user.getUserFullName());
        response.setUserPhoneNumber(user.getUserPhoneNumber());
        response.setUserRole(user.getUserRole());
        response.setUserCreateDate(user.getUserCreateDate());
        response.setUserUpdatedDate(user.getUserUpdatedDate());
        return response;
    }
}
