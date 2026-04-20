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
public class ProductResponse {

    private Long productId;

    private String productName;

    private String productDescription;

    private int productPrice;

    private int productStock;

    private Timestamp productCreatedDate;

    private Long categoryId;
}
