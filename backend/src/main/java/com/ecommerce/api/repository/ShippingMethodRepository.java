package com.ecommerce.api.repository;

import com.ecommerce.api.entity.ShippingMethod;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShippingMethodRepository extends JpaRepository<ShippingMethod, Long> {
    List<ShippingMethod> findByActiveTrueOrderByShippingMethodIdAsc();
}
