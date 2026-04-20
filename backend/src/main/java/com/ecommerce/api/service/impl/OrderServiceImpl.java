package com.ecommerce.api.service.impl;

import com.ecommerce.api.dto.request.OrderRequest;
import com.ecommerce.api.dto.response.OrderResponse;
import com.ecommerce.api.entity.Order;
import com.ecommerce.api.entity.User;
import com.ecommerce.api.repository.OrderRepository;
import com.ecommerce.api.repository.UserRepository;
import com.ecommerce.api.service.IOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements IOrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public OrderResponse createOrder(OrderRequest orderRequest) {
        User user = userRepository.findById(orderRequest.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + orderRequest.getUserId()));
        
        Order order = new Order();
        order.setOrderTotalAmount(orderRequest.getOrderTotalAmount());
        order.setOrderStatus(orderRequest.getOrderStatus());
        order.setOrderCreatedDate(new Timestamp(System.currentTimeMillis()));
        order.setUser(user);
        
        Order savedOrder = orderRepository.save(order);
        return mapToResponse(savedOrder);
    }

    @Override
    public OrderResponse getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));
        return mapToResponse(order);
    }

    @Override
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderResponse> getOrdersByUserId(Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        
        return orderRepository.findAll()
                .stream()
                .filter(order -> order.getUser().getUserId().equals(userId))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public OrderResponse updateOrder(Long orderId, OrderRequest orderRequest) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));
        
        order.setOrderTotalAmount(orderRequest.getOrderTotalAmount());
        order.setOrderStatus(orderRequest.getOrderStatus());
        
        Order updatedOrder = orderRepository.save(order);
        return mapToResponse(updatedOrder);
    }

    @Override
    public void deleteOrder(Long orderId) {
        if (!orderRepository.existsById(orderId)) {
            throw new RuntimeException("Order not found with ID: " + orderId);
        }
        orderRepository.deleteById(orderId);
    }

    private OrderResponse mapToResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setOrderId(order.getOrderId());
        response.setOrderTotalAmount(order.getOrderTotalAmount());
        response.setOrderStatus(order.getOrderStatus());
        response.setOrderCreatedDate(order.getOrderCreatedDate());
        response.setUserId(order.getUser().getUserId());
        return response;
    }
}

