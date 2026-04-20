package com.ecommerce.api.controller.impl;

import com.ecommerce.api.controller.IPaymentMethodController;
import com.ecommerce.api.entity.PaymentMethod;
import com.ecommerce.api.repository.PaymentMethodRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/payment-methods")
public class PaymentMethodControllerImpl implements IPaymentMethodController {

    private final PaymentMethodRepository paymentMethodRepository;

    public PaymentMethodControllerImpl(PaymentMethodRepository paymentMethodRepository) {
        this.paymentMethodRepository = paymentMethodRepository;
    }

    @Override
    public ResponseEntity<List<PaymentMethod>> getAllActivePaymentMethods() {
        return new ResponseEntity<>(paymentMethodRepository.findByActiveTrueOrderByPaymentMethodIdAsc(), HttpStatus.OK);
    }
}
