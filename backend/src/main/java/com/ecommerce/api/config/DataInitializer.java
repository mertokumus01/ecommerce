package com.ecommerce.api.config;

import com.ecommerce.api.entity.*;
import com.ecommerce.api.repository.*;
import org.springframework.boot.CommandLineRunner;

import java.sql.Timestamp;
import java.util.Arrays;
import java.util.List;

// @Configuration
public class DataInitializer {

    // @Bean
    CommandLineRunner initializeData_DISABLED(
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            ProductRepository productRepository,
            OrderRepository orderRepository,
            ReviewRepository reviewRepository) {

        return args -> {
            // Initialize Users
            if (userRepository.count() == 0) {
                User admin = new User();
                admin.setUserEmail("admin@ecommerce.com");
                admin.setUserPassword("$2a$10$slYQmyNdGzin7olVN3p5be");
                admin.setUserFullName("Admin User");
                admin.setUserPhoneNumber("+905551234567");
                admin.setUserRole("ADMIN");

                User user1 = new User();
                user1.setUserEmail("ahmet@mail.com");
                user1.setUserPassword("$2a$10$slYQmyNdGzin7olVN3p5be");
                user1.setUserFullName("Ahmet Yılmaz");
                user1.setUserPhoneNumber("+905551234567");
                user1.setUserRole("USER");

                User user2 = new User();
                user2.setUserEmail("fatima@mail.com");
                user2.setUserPassword("$2a$10$slYQmyNdGzin7olVN3p5be");
                user2.setUserFullName("Fatima Şahin");
                user2.setUserPhoneNumber("+905559876543");
                user2.setUserRole("USER");

                userRepository.saveAll(Arrays.asList(admin, user1, user2));
            }

            // Initialize Categories
            if (categoryRepository.count() == 0) {
                Category electronics = new Category();
                electronics.setCatagory_Name("Electronics");
                electronics.setCatagoryDescription("Electronic devices and gadgets");

                Category accessories = new Category();
                accessories.setCatagory_Name("Accessories");
                accessories.setCatagoryDescription("Phone and computer accessories");

                Category clothing = new Category();
                clothing.setCatagory_Name("Clothing");
                clothing.setCatagoryDescription("Fashion and apparel");

                categoryRepository.saveAll(Arrays.asList(electronics, accessories, clothing));
            }

            // Initialize Products
            if (productRepository.count() == 0) {
                List<Category> categories = categoryRepository.findAll();
                
                Product p1 = new Product();
                p1.setProductName("Premium Wireless Headphones");
                p1.setProductDescription("High-quality wireless headphones with noise cancellation");
                p1.setProductPrice(299);
                p1.setProductStock(25);
                p1.setCategory(categories.get(0));

                Product p2 = new Product();
                p2.setProductName("Laptop Backpack");
                p2.setProductDescription("Durable backpack with laptop compartment");
                p2.setProductPrice(59);
                p2.setProductStock(50);
                p2.setCategory(categories.get(1));

                Product p3 = new Product();
                p3.setProductName("USB-C Cable");
                p3.setProductDescription("Fast charging USB-C cable");
                p3.setProductPrice(15);
                p3.setProductStock(200);
                p3.setCategory(categories.get(1));

                Product p4 = new Product();
                p4.setProductName("4K Webcam");
                p4.setProductDescription("Professional 4K webcam for streaming");
                p4.setProductPrice(199);
                p4.setProductStock(0);
                p4.setCategory(categories.get(0));

                productRepository.saveAll(Arrays.asList(p1, p2, p3, p4));
            }

            // Initialize Orders
            if (orderRepository.count() == 0) {
                List<User> users = userRepository.findAll();
                
                Order order1 = new Order();
                order1.setUser(users.get(1));
                order1.setOrderTotalAmount(1250);
                order1.setOrderStatus("COMPLETED");
                order1.setOrderCreatedDate(new Timestamp(System.currentTimeMillis() - 432000000)); // 5 days ago

                Order order2 = new Order();
                order2.setUser(users.get(2));
                order2.setOrderTotalAmount(895);
                order2.setOrderStatus("PROCESSING");
                order2.setOrderCreatedDate(new Timestamp(System.currentTimeMillis() - 86400000)); // 1 day ago

                orderRepository.saveAll(Arrays.asList(order1, order2));
            }

            // Initialize Reviews
            if (reviewRepository.count() == 0) {
                List<Product> products = productRepository.findAll();
                List<User> users = userRepository.findAll();
                
                Review review1 = new Review();
                review1.setProducts(products.get(0));
                review1.setUsers(users.get(1));
                review1.setReviewRating(5);
                review1.setReviewComment("Excellent product! Highly recommend.");
                review1.setReviewCreatedDate(new Timestamp(System.currentTimeMillis() - 259200000)); // 3 days ago

                Review review2 = new Review();
                review2.setProducts(products.get(0));
                review2.setUsers(users.get(2));
                review2.setReviewRating(4);
                review2.setReviewComment("Good quality, but a bit pricey.");
                review2.setReviewCreatedDate(new Timestamp(System.currentTimeMillis() - 172800000)); // 2 days ago

                reviewRepository.saveAll(Arrays.asList(review1, review2));
            }
        };
    }
}
