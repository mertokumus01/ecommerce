package com.ecommerce.api.controller;

import com.ecommerce.api.dto.request.ProductRequest;
import com.ecommerce.api.dto.response.ProductResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

public interface IProductController {
    
    @PostMapping
    ResponseEntity<ProductResponse> createProduct(@RequestBody ProductRequest productRequest);
    
    @GetMapping("/{id}")
    ResponseEntity<ProductResponse> getProductById(@PathVariable Long id);
    
    @GetMapping
    ResponseEntity<List<ProductResponse>> getAllProducts();
    
    @PutMapping("/{id}")
    ResponseEntity<ProductResponse> updateProduct(@PathVariable Long id, @RequestBody ProductRequest productRequest);
    
    @DeleteMapping("/{id}")
    ResponseEntity<Void> deleteProduct(@PathVariable Long id);
}
