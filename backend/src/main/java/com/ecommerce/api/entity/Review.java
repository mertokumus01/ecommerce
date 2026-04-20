package com.ecommerce.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    @Id
    @Column(name = "review_id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long reviewId;

    @Column(name = "review_rating")
    private int reviewRating;

    @Column(name = "review_comment")
    private String reviewComment;

    @Column(name = "review_created_date")
    private Timestamp reviewCreatedDate;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product products;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User users;
}
