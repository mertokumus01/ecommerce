package com.ecommerce.api.controller;

import com.ecommerce.api.dto.request.OrderItemRequest;
import com.ecommerce.api.dto.response.OrderItemResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

public interface IOrderItemController {
    
    @PostMapping
    ResponseEntity<OrderItemResponse> createOrderItem(@RequestBody OrderItemRequest orderItemRequest);
    
    @GetMapping("/{id}")
    ResponseEntity<OrderItemResponse> getOrderItemById(@PathVariable Long id);
    
    @GetMapping
    ResponseEntity<List<OrderItemResponse>> getAllOrderItems();
    
    @GetMapping("/order/{orderId}")
    ResponseEntity<List<OrderItemResponse>> getOrderItemsByOrderId(@PathVariable Long orderId);
    
    @PutMapping("/{id}")
    ResponseEntity<OrderItemResponse> updateOrderItem(@PathVariable Long id, @RequestBody OrderItemRequest orderItemRequest);
    
    @DeleteMapping("/{id}")
    ResponseEntity<Void> deleteOrderItem(@PathVariable Long id);
}
