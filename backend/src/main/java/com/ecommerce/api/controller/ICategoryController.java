package com.ecommerce.api.controller;

import com.ecommerce.api.dto.request.CategoryRequest;
import com.ecommerce.api.dto.response.CategoryResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

public interface ICategoryController {
    
    @PostMapping
    ResponseEntity<CategoryResponse> createCategory(@RequestBody CategoryRequest categoryRequest);
    
    @GetMapping("/{id}")
    ResponseEntity<CategoryResponse> getCategoryById(@PathVariable Long id);
    
    @GetMapping
    ResponseEntity<List<CategoryResponse>> getAllCategories();
    
    @PutMapping("/{id}")
    ResponseEntity<CategoryResponse> updateCategory(@PathVariable Long id, @RequestBody CategoryRequest categoryRequest);
    
    @DeleteMapping("/{id}")
    ResponseEntity<Void> deleteCategory(@PathVariable Long id);
}
