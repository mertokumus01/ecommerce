package com.ecommerce.api.controller.impl;

import com.ecommerce.api.controller.ICityController;
import com.ecommerce.api.entity.City;
import com.ecommerce.api.repository.CityRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/cities")
public class CityControllerImpl implements ICityController {

    private final CityRepository cityRepository;

    public CityControllerImpl(CityRepository cityRepository) {
        this.cityRepository = cityRepository;
    }

    @Override
    public ResponseEntity<List<City>> getAllActiveCities() {
        return new ResponseEntity<>(cityRepository.findByActiveTrueOrderByCityNameAsc(), HttpStatus.OK);
    }
}
