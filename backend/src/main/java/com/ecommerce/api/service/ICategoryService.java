package com.ecommerce.api.service;

import com.ecommerce.api.dto.request.CategoryRequest;
import com.ecommerce.api.dto.response.CategoryResponse;
import java.util.List;

public interface ICategoryService {
    CategoryResponse createCategory(CategoryRequest categoryRequest);
    
    CategoryResponse getCategoryById(Long categoryId);
    
    List<CategoryResponse> getAllCategories();
    
    CategoryResponse updateCategory(Long categoryId, CategoryRequest categoryRequest);
    
    void deleteCategory(Long categoryId);
}
