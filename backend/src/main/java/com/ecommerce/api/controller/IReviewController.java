package com.ecommerce.api.controller;

import com.ecommerce.api.dto.request.ReviewRequest;
import com.ecommerce.api.dto.response.ReviewResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

public interface IReviewController {
    
    @PostMapping
    ResponseEntity<ReviewResponse> createReview(@RequestBody ReviewRequest reviewRequest);
    
    @GetMapping("/{id}")
    ResponseEntity<ReviewResponse> getReviewById(@PathVariable Long id);
    
    @GetMapping
    ResponseEntity<List<ReviewResponse>> getAllReviews();
    
    @GetMapping("/product/{productId}")
    ResponseEntity<List<ReviewResponse>> getReviewsByProductId(@PathVariable Long productId);
    
    @PutMapping("/{id}")
    ResponseEntity<ReviewResponse> updateReview(@PathVariable Long id, @RequestBody ReviewRequest reviewRequest);
    
    @DeleteMapping("/{id}")
    ResponseEntity<Void> deleteReview(@PathVariable Long id);
}
