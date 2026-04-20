package com.ecommerce.api.service;

import com.ecommerce.api.dto.request.ProductRequest;
import com.ecommerce.api.dto.response.ProductResponse;
import java.util.List;

public interface IProductService {
    ProductResponse createProduct(ProductRequest productRequest);
    
    ProductResponse getProductById(Long productId);
    
    List<ProductResponse> getAllProducts();
    
    ProductResponse updateProduct(Long productId, ProductRequest productRequest);
    
    void deleteProduct(Long productId);
}
