package com.ecommerce.backend.controllers;

import com.ecommerce.backend.models.Order;
import com.ecommerce.backend.models.OrderItem;
import com.ecommerce.backend.models.User;
import com.ecommerce.backend.repositories.OrderItemRepository;
import com.ecommerce.backend.repositories.OrderRepository;
import com.ecommerce.backend.repositories.ProductRepository;
import com.ecommerce.backend.repositories.UserRepository;
import com.ecommerce.backend.security.JwtUtil;
import com.ecommerce.backend.services.OrderService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import jakarta.servlet.http.Cookie;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = OrderController.class, excludeAutoConfiguration = SecurityAutoConfiguration.class)
public class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OrderService orderService;

    @MockBean
    private OrderRepository orderRepository;

    @MockBean
    private OrderItemRepository orderItemRepository;

    @MockBean
    private ProductRepository productRepository;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private JwtUtil jwtUtil;

    @Autowired
    private ObjectMapper objectMapper;

    private User user;
    private Order order;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setUsername("testuser");

        order = new Order();
        order.setId(1L);
        order.setUserId(user.getId());
    }

    @Test
    void createOrder_withValidToken_shouldReturnOk() throws Exception {
        when(jwtUtil.getUsernameFromToken("test-token")).thenReturn("testuser");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        mockMvc.perform(post("/api/orders")
                .with(csrf())
                .cookie(new Cookie("user_token", "test-token"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new Order())))
                .andExpect(status().isOk());
    }

    @Test
    void addOrderItems_shouldReturnOk() throws Exception {
        com.ecommerce.backend.controllers.OrderItemRequest orderItemRequest = new com.ecommerce.backend.controllers.OrderItemRequest();
        orderItemRequest.setProductId(1L);
        orderItemRequest.setQuantity(2);
        
        when(orderRepository.findById(anyLong())).thenReturn(Optional.of(order));
        when(productRepository.findById(anyLong())).thenReturn(Optional.of(new com.ecommerce.backend.models.Product()));
        when(orderItemRepository.saveAll(any(List.class))).thenReturn(Collections.singletonList(new OrderItem()));

        mockMvc.perform(post("/api/orders/1/items")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(List.of(orderItemRequest))))
                .andExpect(status().isOk());
    }
}