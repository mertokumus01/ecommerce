package com.ecommerce.api.repository;

import com.ecommerce.api.entity.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Long> {
    List<PaymentMethod> findByActiveTrueOrderByPaymentMethodIdAsc();
}
