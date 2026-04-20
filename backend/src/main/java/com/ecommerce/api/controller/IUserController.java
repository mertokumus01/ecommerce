package com.ecommerce.api.controller;

import com.ecommerce.api.dto.request.UserRequest;
import com.ecommerce.api.dto.request.UserUpdateRequest;
import com.ecommerce.api.dto.response.UserResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

public interface IUserController {

    @PostMapping(path = "/save")
    public ResponseEntity<UserResponse> saveUser(@RequestBody UserRequest userRequest);

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers();

    @GetMapping(path = "/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id);

    @GetMapping(path = "/by-email/{email}")
    public ResponseEntity<UserResponse> getUserByEmail(@PathVariable String email);

    @PutMapping(path = "/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @RequestBody UserUpdateRequest userRequest);

    @DeleteMapping(path = "/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id);
}
