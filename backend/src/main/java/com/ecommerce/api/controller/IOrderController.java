package com.ecommerce.api.controller;

import com.ecommerce.api.dto.request.OrderRequest;
import com.ecommerce.api.dto.response.OrderResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

public interface IOrderController {
    
    @PostMapping
    ResponseEntity<OrderResponse> createOrder(@RequestBody OrderRequest orderRequest);
    
    @GetMapping("/{id}")
    ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id);
    
    @GetMapping
    ResponseEntity<List<OrderResponse>> getAllOrders();
    
    @GetMapping("/user/{userId}")
    ResponseEntity<List<OrderResponse>> getOrdersByUserId(@PathVariable Long userId);
    
    @PutMapping("/{id}")
    ResponseEntity<OrderResponse> updateOrder(@PathVariable Long id, @RequestBody OrderRequest orderRequest);
    
    @DeleteMapping("/{id}")
    ResponseEntity<Void> deleteOrder(@PathVariable Long id);
}
