package com.ecommerce.api.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequest {

    @NotNull(message = "Order total amount is required")
    @Min(value = 0, message = "Order total amount must be greater than 0")
    private int orderTotalAmount;

    @NotBlank(message = "Order status is required")
    private String orderStatus;

    @NotNull(message = "User ID is required")
    private Long userId;
}
