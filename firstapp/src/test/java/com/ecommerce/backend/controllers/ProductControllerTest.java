package com.ecommerce.backend.controllers;

import com.ecommerce.backend.models.Product;
import com.ecommerce.backend.repositories.CategoryRepository;
import com.ecommerce.backend.repositories.ProductRepository;
import com.ecommerce.backend.services.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = ProductController.class, excludeAutoConfiguration = SecurityAutoConfiguration.class)
public class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @MockBean
    private ProductRepository productRepository;

    @MockBean
    private CategoryRepository categoryRepository;

    private Product product1;
    private Product product2;

    @BeforeEach
    void setUp() {
        product1 = new Product();
        product1.setId(1L);
        product1.setName("Product 1");
        product1.setPrice(new BigDecimal("10.00"));
        product1.setStock(100);

        product2 = new Product();
        product2.setId(2L);
        product2.setName("Product 2");
        product2.setPrice(new BigDecimal("20.00"));
        product2.setStock(50);
    }

    @Test
    void getAllProducts_shouldReturnListOfProducts() throws Exception {
        when(productService.getAllProducts()).thenReturn(List.of(product1, product2));

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", is(2)))
                .andExpect(jsonPath("$[0].name", is("Product 1")))
                .andExpect(jsonPath("$[1].name", is("Product 2")));
    }

    @Test
    void getProductById_whenProductExists_shouldReturnProduct() throws Exception {
        when(productService.getProductById(1L)).thenReturn(product1);

        mockMvc.perform(get("/api/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Product 1")));
    }

    @Test
    void cutQuantityJson_withSufficientStock_shouldReturnOk() throws Exception {
        when(productService.cutQuantity(anyLong(), anyInt())).thenReturn(Map.of("remainingQty", 90));

        mockMvc.perform(post("/api/products/1/quantity/cut")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"qty\": 10}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.remainingQty", is(90)));
    }

    @Test
    void cutQuantityJson_withInsufficientStock_shouldReturnBadRequest() throws Exception {
        when(productService.cutQuantity(anyLong(), anyInt())).thenThrow(new IllegalArgumentException("Insufficient stock"));

        mockMvc.perform(post("/api/products/1/quantity/cut")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"qty\": 110}"))
                .andExpect(status().isBadRequest());
    }
}
