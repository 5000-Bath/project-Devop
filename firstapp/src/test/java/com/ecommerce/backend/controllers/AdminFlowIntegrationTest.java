package com.ecommerce.backend.controllers;

import com.ecommerce.backend.dtos.UpdateStatusRequest;
import com.ecommerce.backend.models.Admin;
import com.ecommerce.backend.models.Order;
import com.ecommerce.backend.models.OrderStatus;
import com.ecommerce.backend.models.Product;
import com.ecommerce.backend.repositories.AdminRepository;
import com.ecommerce.backend.repositories.OrderRepository;
import com.ecommerce.backend.repositories.ProductRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import jakarta.servlet.http.Cookie;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AdminFlowIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    private Cookie adminToken;

    @BeforeEach
    void setUp() throws Exception {
        adminRepository.deleteAll();
        orderRepository.deleteAll();
        productRepository.deleteAll();

        // Create and login admin to get token
        Admin admin = new Admin();
        admin.setUsername("superadmin");
        admin.setPassword("password123"); // Password will be hashed by model's setter
        admin.setEmail("superadmin@example.com");
        adminRepository.save(admin);

        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("username", "superadmin");
        loginRequest.put("password", "password123");

        MvcResult result = mockMvc.perform(post("/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        adminToken = result.getResponse().getCookie("admin_token");
    }

    @Test
    void adminCanGetAllOrders() throws Exception {
        // Given: Create a sample order
        Order order = new Order();
        order.setUserId(1L); // Dummy user id
        orderRepository.save(order);

        // When & Then
        mockMvc.perform(get("/api/orders").cookie(adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(1));
    }

    @Test
    void adminCanUpdateOrderStatus() throws Exception {
        // Given: Create a sample order and product
        Product product = new Product();
        product.setName("Test Book");
        product.setPrice(new BigDecimal("50.00"));
        product.setStock(10);
        productRepository.save(product);

        Order order = new Order();
        order.setUserId(1L);
        orderRepository.save(order);

        UpdateStatusRequest updateRequest = new UpdateStatusRequest();
        updateRequest.setStatus(OrderStatus.SUCCESS);

        // When & Then
        mockMvc.perform(put("/api/orders/" + order.getId() + "/status")
                        .with(csrf())
                        .cookie(adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SUCCESS"));

        Order updatedOrder = orderRepository.findById(order.getId()).orElseThrow();
        assertEquals(OrderStatus.SUCCESS, updatedOrder.getStatus());
    }
}
