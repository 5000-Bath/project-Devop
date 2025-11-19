package com.ecommerce.backend.controllers;

import com.ecommerce.backend.models.Product;
import com.ecommerce.backend.repositories.ProductRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class ProductControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        productRepository.deleteAll();
    }

    @Test
    void getAllProducts_shouldReturnListOfProducts() throws Exception {
        // Given
        Product product1 = new Product();
        product1.setName("Laptop");
        product1.setPrice(new BigDecimal("1200.00"));
        productRepository.save(product1);

        // When & Then
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", is(1)))
                .andExpect(jsonPath("$[0].name", is("Laptop")));
    }

    @Test
    void createProduct_shouldCreateAndReturnProduct() throws Exception {
        MockMultipartFile image = new MockMultipartFile("image", "test.jpg", MediaType.IMAGE_JPEG_VALUE, "test image".getBytes());

        mockMvc.perform(multipart("/api/products")
                        .file(image)
                        .param("name", "New Keyboard")
                        .param("price", "75.50")
                        .param("stock", "150")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("New Keyboard")))
                .andExpect(jsonPath("$.stock", is(150)));

        List<Product> products = productRepository.findAll();
        assertEquals(1, products.size());
        assertEquals("New Keyboard", products.get(0).getName());
    }

    @Test
    void cutQuantity_withSufficientStock_shouldDecreaseStock() throws Exception {
        // Given
        Product product = new Product();
        product.setName("Mouse");
        product.setPrice(new BigDecimal("25.00"));
        product.setStock(100);
        Product savedProduct = productRepository.save(product);

        // When & Then
        String requestBody = "{\"qty\": 10}";
        mockMvc.perform(post("/api/products/" + savedProduct.getId() + "/quantity/cut")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.remainingQty", is(90)));

        Product updatedProduct = productRepository.findById(savedProduct.getId()).orElseThrow();
        assertEquals(90, updatedProduct.getStock());
    }
}
