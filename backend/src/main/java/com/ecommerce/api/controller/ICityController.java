package com.ecommerce.api.controller;

import com.ecommerce.api.entity.City;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

public interface ICityController {

    @GetMapping
    ResponseEntity<List<City>> getAllActiveCities();
}
