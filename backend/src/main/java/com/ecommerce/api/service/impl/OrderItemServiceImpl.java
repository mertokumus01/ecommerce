package com.ecommerce.api.service.impl;

import com.ecommerce.api.dto.request.OrderItemRequest;
import com.ecommerce.api.dto.response.OrderItemResponse;
import com.ecommerce.api.entity.OrderItem;
import com.ecommerce.api.entity.Order;
import com.ecommerce.api.entity.Product;
import com.ecommerce.api.repository.OrderItemRepository;
import com.ecommerce.api.repository.OrderRepository;
import com.ecommerce.api.repository.ProductRepository;
import com.ecommerce.api.service.IOrderItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderItemServiceImpl implements IOrderItemService {

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public OrderItemResponse createOrderItem(OrderItemRequest orderItemRequest) {
        Order order = orderRepository.findById(orderItemRequest.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderItemRequest.getOrderId()));
        
        Product product = productRepository.findById(orderItemRequest.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + orderItemRequest.getProductId()));
        
        OrderItem orderItem = new OrderItem();
        orderItem.setOrderItemQuantity(orderItemRequest.getOrderItemQuantity());
        orderItem.setOrderItemPrice(orderItemRequest.getOrderItemPrice());
        orderItem.setOrders(order);
        orderItem.setProducts(product);
        
        OrderItem savedOrderItem = orderItemRepository.save(orderItem);
        return mapToResponse(savedOrderItem);
    }

    @Override
    public OrderItemResponse getOrderItemById(Long orderItemId) {
        OrderItem orderItem = orderItemRepository.findById(orderItemId)
                .orElseThrow(() -> new RuntimeException("OrderItem not found with ID: " + orderItemId));
        return mapToResponse(orderItem);
    }

    @Override
    public List<OrderItemResponse> getAllOrderItems() {
        return orderItemRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderItemResponse> getOrderItemsByOrderId(Long orderId) {
        orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));
        
        return orderItemRepository.findAll()
                .stream()
                .filter(orderItem -> orderItem.getOrders().getOrderId().equals(orderId))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public OrderItemResponse updateOrderItem(Long orderItemId, OrderItemRequest orderItemRequest) {
        OrderItem orderItem = orderItemRepository.findById(orderItemId)
                .orElseThrow(() -> new RuntimeException("OrderItem not found with ID: " + orderItemId));
        
        orderItem.setOrderItemQuantity(orderItemRequest.getOrderItemQuantity());
        orderItem.setOrderItemPrice(orderItemRequest.getOrderItemPrice());
        
        OrderItem updatedOrderItem = orderItemRepository.save(orderItem);
        return mapToResponse(updatedOrderItem);
    }

    @Override
    public void deleteOrderItem(Long orderItemId) {
        if (!orderItemRepository.existsById(orderItemId)) {
            throw new RuntimeException("OrderItem not found with ID: " + orderItemId);
        }
        orderItemRepository.deleteById(orderItemId);
    }

    private OrderItemResponse mapToResponse(OrderItem orderItem) {
        OrderItemResponse response = new OrderItemResponse();
        response.setOrderItemId(orderItem.getOrderItemId());
        response.setOrderItemQuantity(orderItem.getOrderItemQuantity());
        response.setOrderItemPrice(orderItem.getOrderItemPrice());
        response.setOrderId(orderItem.getOrders().getOrderId());
        response.setProductId(orderItem.getProducts().getProductId());
        return response;
    }
}

