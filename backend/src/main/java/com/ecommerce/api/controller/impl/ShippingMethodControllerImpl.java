package com.ecommerce.api.controller.impl;

import com.ecommerce.api.controller.IShippingMethodController;
import com.ecommerce.api.entity.ShippingMethod;
import com.ecommerce.api.repository.ShippingMethodRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/shipping-methods")
public class ShippingMethodControllerImpl implements IShippingMethodController {

    private final ShippingMethodRepository shippingMethodRepository;

    public ShippingMethodControllerImpl(ShippingMethodRepository shippingMethodRepository) {
        this.shippingMethodRepository = shippingMethodRepository;
    }

    @Override
    public ResponseEntity<List<ShippingMethod>> getAllActiveShippingMethods() {
        return new ResponseEntity<>(shippingMethodRepository.findByActiveTrueOrderByShippingMethodIdAsc(), HttpStatus.OK);
    }
}
