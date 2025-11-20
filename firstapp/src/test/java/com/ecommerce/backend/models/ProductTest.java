package com.ecommerce.backend.models;

import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class ProductTest {

    @Test
    void testProductGettersAndSetters() {
        Product product = new Product();
        Long id = 1L;
        String name = "Laptop";
        String description = "A powerful laptop";
        BigDecimal price = new BigDecimal("1200.50");
        int stock = 50;
        boolean isActive = true;
        String imageUrl = "http://example.com/laptop.jpg";
        LocalDateTime createdAt = LocalDateTime.now();
        LocalDateTime deletedAt = null;
        String category = "Electronics";

        product.setId(id);
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setStock(stock);
        product.setIsActive(isActive);
        product.setImageUrl(imageUrl);
        product.setCreatedAt(createdAt);
        product.setDeletedAt(deletedAt);
        product.setCategory(category);

        assertEquals(id, product.getId());
        assertEquals(name, product.getName());
        assertEquals(description, product.getDescription());
        assertEquals(0, price.compareTo(product.getPrice()));
        assertEquals(stock, product.getStock());
        assertTrue(product.getIsActive());
        assertEquals(imageUrl, product.getImageUrl());
        assertEquals(createdAt, product.getCreatedAt());
        assertEquals(deletedAt, product.getDeletedAt());
        assertEquals(category, product.getCategory());
    }
}