package com.ecommerce.api.service;

import com.ecommerce.api.dto.request.ReviewRequest;
import com.ecommerce.api.dto.response.ReviewResponse;
import java.util.List;

public interface IReviewService {
    ReviewResponse createReview(ReviewRequest reviewRequest);
    
    ReviewResponse getReviewById(Long reviewId);
    
    List<ReviewResponse> getAllReviews();
    
    List<ReviewResponse> getReviewsByProductId(Long productId);
    
    ReviewResponse updateReview(Long reviewId, ReviewRequest reviewRequest);
    
    void deleteReview(Long reviewId);
}
