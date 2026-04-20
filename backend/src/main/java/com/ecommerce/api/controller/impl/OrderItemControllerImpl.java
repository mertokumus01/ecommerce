package com.ecommerce.api.controller.impl;

import com.ecommerce.api.controller.IOrderItemController;
import com.ecommerce.api.dto.request.OrderItemRequest;
import com.ecommerce.api.dto.response.OrderItemResponse;
import com.ecommerce.api.service.IOrderItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/order-items")
public class OrderItemControllerImpl implements IOrderItemController {

    @Autowired
    private IOrderItemService orderItemService;

    @Override
    public ResponseEntity<OrderItemResponse> createOrderItem(OrderItemRequest orderItemRequest) {
        OrderItemResponse response = orderItemService.createOrderItem(orderItemRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<OrderItemResponse> getOrderItemById(Long id) {
        OrderItemResponse response = orderItemService.getOrderItemById(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<List<OrderItemResponse>> getAllOrderItems() {
        List<OrderItemResponse> responses = orderItemService.getAllOrderItems();
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<List<OrderItemResponse>> getOrderItemsByOrderId(Long orderId) {
        List<OrderItemResponse> responses = orderItemService.getOrderItemsByOrderId(orderId);
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<OrderItemResponse> updateOrderItem(Long id, OrderItemRequest orderItemRequest) {
        OrderItemResponse response = orderItemService.updateOrderItem(id, orderItemRequest);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Void> deleteOrderItem(Long id) {
        orderItemService.deleteOrderItem(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
