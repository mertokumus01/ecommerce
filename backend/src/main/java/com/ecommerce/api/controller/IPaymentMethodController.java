package com.ecommerce.api.controller;

import com.ecommerce.api.entity.PaymentMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

public interface IPaymentMethodController {

    @GetMapping
    ResponseEntity<List<PaymentMethod>> getAllActivePaymentMethods();
}
