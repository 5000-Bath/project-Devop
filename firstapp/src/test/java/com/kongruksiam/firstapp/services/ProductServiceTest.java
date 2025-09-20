package com.kongruksiam.firstapp.services;

import com.kongruksiam.firstapp.models.Product;
import com.kongruksiam.firstapp.repositories.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ProductServiceTest {

    @InjectMocks
    private ProductService productService;

    @Mock
    private ProductRepository productRepository;

    @Test
    void testGetAllProducts() {
        // 1. Arrange: Create mock data
        List<Product> productList = new ArrayList<>();
        Product p1 = new Product();
        p1.setId(1L);
        p1.setName("Test Product 1");
        p1.setPrice(new BigDecimal("10.00"));
        productList.add(p1);

        Product p2 = new Product();
        p2.setId(2L);
        p2.setName("Test Product 2");
        p2.setPrice(new BigDecimal("20.00"));
        productList.add(p2);

        // Define the behavior of the mock repository
        when(productRepository.findAll()).thenReturn(productList);

        // 2. Act: Call the service method
        List<Product> result = productService.getAllProducts();

        // 3. Assert: Check the results
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Test Product 1", result.get(0).getName());
        assertEquals("Test Product 2", result.get(1).getName());
    }
}
