package com.ecommerce.api.service;

import com.ecommerce.api.dto.request.OrderItemRequest;
import com.ecommerce.api.dto.response.OrderItemResponse;
import java.util.List;

public interface IOrderItemService {
    OrderItemResponse createOrderItem(OrderItemRequest orderItemRequest);
    
    OrderItemResponse getOrderItemById(Long orderItemId);
    
    List<OrderItemResponse> getAllOrderItems();
    
    List<OrderItemResponse> getOrderItemsByOrderId(Long orderId);
    
    OrderItemResponse updateOrderItem(Long orderItemId, OrderItemRequest orderItemRequest);
    
    void deleteOrderItem(Long orderItemId);
}
