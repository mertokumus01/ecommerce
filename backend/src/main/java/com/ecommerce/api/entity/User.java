package com.ecommerce.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {


    @Id
    @Column(name = "user_id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long userId;

    @Column(name = "user_email",nullable = false)
    private String userEmail;

    @Column(name = "user_password",nullable = false)
    private String userPassword;

    @Column(name = "user_full_name")
    private String userFullName;

    @Column(name = "user_phone_number")
    private String userPhoneNumber;

    @CreationTimestamp
    @Column(name = "user_create_date",updatable = false)
    private Timestamp userCreateDate;

    @UpdateTimestamp
    @Column(name = "user_updated_date")
    private Timestamp userUpdatedDate;

    @Column(name = "user_role")
    private String userRole;

    @OneToMany(mappedBy = "user")
    private List<Order> orders;

    @OneToMany(mappedBy = "users")
    private List<Review> reviews;
}
