package com.ecommerce.api.config;

import com.ecommerce.api.entity.City;
import com.ecommerce.api.entity.PaymentMethod;
import com.ecommerce.api.entity.ShippingMethod;
import com.ecommerce.api.repository.CityRepository;
import com.ecommerce.api.repository.PaymentMethodRepository;
import com.ecommerce.api.repository.ShippingMethodRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CheckoutOptionsInitializer implements CommandLineRunner {

    private final ShippingMethodRepository shippingMethodRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final CityRepository cityRepository;

    public CheckoutOptionsInitializer(
            ShippingMethodRepository shippingMethodRepository,
            PaymentMethodRepository paymentMethodRepository,
            CityRepository cityRepository
    ) {
        this.shippingMethodRepository = shippingMethodRepository;
        this.paymentMethodRepository = paymentMethodRepository;
        this.cityRepository = cityRepository;
    }

    @Override
    public void run(String... args) {
        if (shippingMethodRepository.count() == 0) {
            shippingMethodRepository.saveAll(List.of(
                    new ShippingMethod(null, "Standart Kargo", "3-5 is gunu", 10, true),
                    new ShippingMethod(null, "Hizli Kargo", "1-2 is gunu", 25, true),
                    new ShippingMethod(null, "Ayni Gun Teslimat", "Sadece secili bolgelerde", 50, true)
            ));
        }

        if (paymentMethodRepository.count() == 0) {
            paymentMethodRepository.saveAll(List.of(
                    new PaymentMethod(null, "Kredi Karti", "Visa / MasterCard", "💳", true),
                    new PaymentMethod(null, "Banka Transferi", "Havale / EFT", "🏦", true),
                    new PaymentMethod(null, "Kapida Odeme", "Teslimatta odeme", "💵", true)
            ));
        }

        if (cityRepository.count() == 0) {
            cityRepository.saveAll(List.of(
                    new City(null, "Ankara", "ankara", true),
                    new City(null, "Antalya", "antalya", true),
                    new City(null, "Bursa", "bursa", true),
                    new City(null, "Istanbul", "istanbul", true),
                    new City(null, "Izmir", "izmir", true)
            ));
        }
    }
}
