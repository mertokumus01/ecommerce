package com.ecommerce.api.service.impl;

import com.ecommerce.api.dto.request.ReviewRequest;
import com.ecommerce.api.dto.response.ReviewResponse;
import com.ecommerce.api.entity.Review;
import com.ecommerce.api.entity.Product;
import com.ecommerce.api.entity.User;
import com.ecommerce.api.repository.ReviewRepository;
import com.ecommerce.api.repository.ProductRepository;
import com.ecommerce.api.repository.UserRepository;
import com.ecommerce.api.service.IReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements IReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public ReviewResponse createReview(ReviewRequest reviewRequest) {
        Product product = productRepository.findById(reviewRequest.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + reviewRequest.getProductId()));
        
        User user = userRepository.findById(reviewRequest.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + reviewRequest.getUserId()));
        
        Review review = new Review();
        review.setReviewRating(reviewRequest.getReviewRating());
        review.setReviewComment(reviewRequest.getReviewComment());
        review.setReviewCreatedDate(new Timestamp(System.currentTimeMillis()));
        review.setProducts(product);
        review.setUsers(user);
        
        Review savedReview = reviewRepository.save(review);
        return mapToResponse(savedReview);
    }

    @Override
    public ReviewResponse getReviewById(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with ID: " + reviewId));
        return mapToResponse(review);
    }

    @Override
    public List<ReviewResponse> getAllReviews() {
        return reviewRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewResponse> getReviewsByProductId(Long productId) {
        productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productId));
        
        return reviewRepository.findAll()
                .stream()
                .filter(review -> review.getProducts().getProductId().equals(productId))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ReviewResponse updateReview(Long reviewId, ReviewRequest reviewRequest) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with ID: " + reviewId));
        
        review.setReviewRating(reviewRequest.getReviewRating());
        review.setReviewComment(reviewRequest.getReviewComment());
        
        Review updatedReview = reviewRepository.save(review);
        return mapToResponse(updatedReview);
    }

    @Override
    public void deleteReview(Long reviewId) {
        if (!reviewRepository.existsById(reviewId)) {
            throw new RuntimeException("Review not found with ID: " + reviewId);
        }
        reviewRepository.deleteById(reviewId);
    }

    private ReviewResponse mapToResponse(Review review) {
        ReviewResponse response = new ReviewResponse();
        response.setReviewId(review.getReviewId());
        response.setReviewRating(review.getReviewRating());
        response.setReviewComment(review.getReviewComment());
        response.setReviewCreatedDate(review.getReviewCreatedDate());
        response.setProductId(review.getProducts().getProductId());
        response.setUserId(review.getUsers().getUserId());
        return response;
    }
}
