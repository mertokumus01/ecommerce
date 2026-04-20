package com.ecommerce.api.controller.impl;

import com.ecommerce.api.controller.IReviewController;
import com.ecommerce.api.dto.request.ReviewRequest;
import com.ecommerce.api.dto.response.ReviewResponse;
import com.ecommerce.api.service.IReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/reviews")
public class ReviewControllerImpl implements IReviewController {

    @Autowired
    private IReviewService reviewService;

    @Override
    public ResponseEntity<ReviewResponse> createReview(ReviewRequest reviewRequest) {
        ReviewResponse response = reviewService.createReview(reviewRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<ReviewResponse> getReviewById(Long id) {
        ReviewResponse response = reviewService.getReviewById(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<List<ReviewResponse>> getAllReviews() {
        List<ReviewResponse> responses = reviewService.getAllReviews();
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<List<ReviewResponse>> getReviewsByProductId(Long productId) {
        List<ReviewResponse> responses = reviewService.getReviewsByProductId(productId);
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<ReviewResponse> updateReview(Long id, ReviewRequest reviewRequest) {
        ReviewResponse response = reviewService.updateReview(id, reviewRequest);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Void> deleteReview(Long id) {
        reviewService.deleteReview(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
