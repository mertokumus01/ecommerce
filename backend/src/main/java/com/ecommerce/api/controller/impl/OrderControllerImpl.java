package com.ecommerce.api.controller.impl;

import com.ecommerce.api.controller.IOrderController;
import com.ecommerce.api.dto.request.OrderRequest;
import com.ecommerce.api.dto.response.OrderResponse;
import com.ecommerce.api.service.IOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderControllerImpl implements IOrderController {

    @Autowired
    private IOrderService orderService;

    @Override
    public ResponseEntity<OrderResponse> createOrder(OrderRequest orderRequest) {
        OrderResponse response = orderService.createOrder(orderRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<OrderResponse> getOrderById(Long id) {
        OrderResponse response = orderService.getOrderById(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        List<OrderResponse> responses = orderService.getAllOrders();
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<List<OrderResponse>> getOrdersByUserId(Long userId) {
        List<OrderResponse> responses = orderService.getOrdersByUserId(userId);
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<OrderResponse> updateOrder(Long id, OrderRequest orderRequest) {
        OrderResponse response = orderService.updateOrder(id, orderRequest);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Void> deleteOrder(Long id) {
        orderService.deleteOrder(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
