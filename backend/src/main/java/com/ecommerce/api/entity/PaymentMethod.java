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
@Table(name = "payment_methods")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentMethod {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "payment_method_id")
    private Long paymentMethodId;

    @Column(name = "payment_name", nullable = false)
    private String paymentName;

    @Column(name = "payment_description", nullable = false)
    private String paymentDescription;

    @Column(name = "payment_icon", nullable = false)
    private String paymentIcon;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;
}
