package com.ecommerce.api.controller;

import com.ecommerce.api.entity.ShippingMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

public interface IShippingMethodController {

    @GetMapping
    ResponseEntity<List<ShippingMethod>> getAllActiveShippingMethods();
}
