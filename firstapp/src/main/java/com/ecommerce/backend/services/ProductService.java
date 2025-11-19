package com.ecommerce.backend.services;

import com.ecommerce.backend.models.Product;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface ProductService {
    List<Product> getAllProducts();
    Product getProductById(Long id);
    Product createProduct(String name, String description, BigDecimal price, int stock, boolean isActive, MultipartFile image);
    Product updateProduct(Long id, Map<String, Object> updates);
    Map<String, Object> cutQuantity(Long id, int qty);
    void softDeleteProduct(Long id);
}