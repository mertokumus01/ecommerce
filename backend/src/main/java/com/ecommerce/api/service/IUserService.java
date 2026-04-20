package com.ecommerce.api.service;

import com.ecommerce.api.dto.request.UserRequest;
import com.ecommerce.api.dto.request.UserUpdateRequest;
import com.ecommerce.api.dto.response.UserResponse;

import java.util.List;

public interface IUserService {

    public UserResponse saveUser(UserRequest userRequest);

    public List<UserResponse> getAllUsers();

    public UserResponse getUserById(Long id);

    public UserResponse getUserByEmail(String email);

    public UserResponse updateUser(Long id, UserUpdateRequest userRequest);

    public void deleteUser(Long id);
}
