package com.ecommerce.api.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemRequest {
    
    @NotNull(message = "Order item quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private int orderItemQuantity;
    
    @NotNull(message = "Order item price is required")
    @Min(value = 0, message = "Price must be greater than 0")
    private int orderItemPrice;
    
    @NotNull(message = "Order ID is required")
    private Long orderId;
    
    @NotNull(message = "Product ID is required")
    private Long productId;
}
