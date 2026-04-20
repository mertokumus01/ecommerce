package com.ecommerce.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    private Long reviewId;
    private int reviewRating;
    private String reviewComment;
    private Timestamp reviewCreatedDate;
    private Long productId;
    private Long userId;
}
