package com.ecommerce.api.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "shipping_methods")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ShippingMethod {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "shipping_method_id")
    private Long shippingMethodId;

    @Column(name = "shipping_name", nullable = false)
    private String shippingName;

    @Column(name = "shipping_description", nullable = false)
    private String shippingDescription;

    @Column(name = "shipping_price", nullable = false)
    private int shippingPrice;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;
}
