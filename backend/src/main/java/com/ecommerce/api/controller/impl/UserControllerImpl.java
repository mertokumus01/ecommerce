package com.ecommerce.api.controller.impl;

import com.ecommerce.api.controller.IUserController;
import com.ecommerce.api.dto.request.UserRequest;
import com.ecommerce.api.dto.request.UserUpdateRequest;
import com.ecommerce.api.dto.response.UserResponse;
import com.ecommerce.api.service.IUserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserControllerImpl implements IUserController {

    @Autowired
    private IUserService userService;

    @Override
    public ResponseEntity<UserResponse> saveUser(@RequestBody @Valid UserRequest userRequest) {
        return new ResponseEntity<>(userService.saveUser(userRequest), HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<UserResponse> getUserById(Long id) {
        return new ResponseEntity<>(userService.getUserById(id), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<UserResponse> getUserByEmail(String email) {
        return new ResponseEntity<>(userService.getUserByEmail(email), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<UserResponse> updateUser(Long id, UserUpdateRequest userRequest) {
        return new ResponseEntity<>(userService.updateUser(id, userRequest), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Void> deleteUser(Long id) {
        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
