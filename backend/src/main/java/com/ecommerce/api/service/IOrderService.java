package com.ecommerce.api.service;

import com.ecommerce.api.dto.request.OrderRequest;
import com.ecommerce.api.dto.response.OrderResponse;
import java.util.List;

public interface IOrderService {
    OrderResponse createOrder(OrderRequest orderRequest);
    
    OrderResponse getOrderById(Long orderId);
    
    List<OrderResponse> getAllOrders();
    
    List<OrderResponse> getOrdersByUserId(Long userId);
    
    OrderResponse updateOrder(Long orderId, OrderRequest orderRequest);
    
    void deleteOrder(Long orderId);
}
