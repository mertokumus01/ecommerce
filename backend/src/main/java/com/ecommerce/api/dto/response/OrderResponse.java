package com.ecommerce.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponse {

    private Long orderId;

    private int orderTotalAmount;

    private String orderStatus;

    private Timestamp orderCreatedDate;

    private Long userId;
}
