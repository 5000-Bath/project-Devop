package com.ecommerce.backend.controllers;

import com.ecommerce.backend.dtos.UpdateStatusRequest;
import com.ecommerce.backend.models.*;
import com.ecommerce.backend.repositories.OrderItemRepository;
import com.ecommerce.backend.repositories.OrderRepository;
import com.ecommerce.backend.repositories.ProductRepository;
import com.ecommerce.backend.repositories.UserRepository;
import com.ecommerce.backend.security.JwtUtil;
import com.ecommerce.backend.services.OrderService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList; // Import เพิ่ม
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(OrderController.class)
@AutoConfigureMockMvc(addFilters = false)
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean private OrderService orderService;
    @MockBean private UserRepository userRepository;
    @MockBean private JwtUtil jwtUtil;
    @MockBean private OrderRepository orderRepository;
    @MockBean private OrderItemRepository orderItemRepository;
    @MockBean private ProductRepository productRepository;

    // --- 1. Test Create Order ---
    @Test
    void createOrder_Success() throws Exception {
        String token = "user-token";
        Cookie cookie = new Cookie("user_token", token);
        User user = new User();
        user.setId(1L);
        user.setUsername("user1");

        when(jwtUtil.getUsernameFromToken(token)).thenReturn("user1");
        when(userRepository.findByUsername("user1")).thenReturn(Optional.of(user));
        when(orderService.createOrder(any(Order.class))).thenReturn(new Order());

        mockMvc.perform(post("/api/orders")
                        .cookie(cookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new Order())))
                .andExpect(status().isOk());
    }

    @Test
    void createOrder_Unauthorized_NoToken() throws Exception {
        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new Order())))
                .andExpect(status().isUnauthorized());
    }

    // --- 2. Test Get All Orders ---
    @Test
    void getAllOrders_User_Success() throws Exception {
        String token = "user-token";
        Cookie cookie = new Cookie("user_token", token);
        User user = new User();
        user.setId(1L);

        when(jwtUtil.getUsernameFromToken(token)).thenReturn("user1");
        when(userRepository.findByUsername("user1")).thenReturn(Optional.of(user));
        when(orderRepository.findByUserIdOrderByCreatedAtDesc(1L)).thenReturn(List.of(new Order()));

        mockMvc.perform(get("/api/orders").cookie(cookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    void getAllOrders_Admin_Success() throws Exception {
        String token = "admin-token";
        Cookie cookie = new Cookie("admin_token", token);

        when(jwtUtil.getUsernameFromToken(token)).thenReturn("admin1");
        when(orderRepository.findAll()).thenReturn(List.of(new Order(), new Order()));

        mockMvc.perform(get("/api/orders").cookie(cookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    // --- 3. Test Get Order By ID ---
    @Test
    void getOrderById_User_Owner_Success() throws Exception {
        String token = "user-token";
        Cookie cookie = new Cookie("user_token", token);
        User user = new User();
        user.setId(1L);

        Order order = new Order();
        order.setId(100L);
        order.setUserId(1L);

        when(orderRepository.findByIdWithOrderItems(100L)).thenReturn(Optional.of(order));
        when(jwtUtil.getUsernameFromToken(token)).thenReturn("user1");
        when(userRepository.findByUsername("user1")).thenReturn(Optional.of(user));

        mockMvc.perform(get("/api/orders/100").cookie(cookie))
                .andExpect(status().isOk());
    }

    @Test
    void getOrderById_User_NotOwner_Forbidden() throws Exception {
        String token = "user-token";
        Cookie cookie = new Cookie("user_token", token);
        User user = new User();
        user.setId(1L);

        Order order = new Order();
        order.setId(100L);
        order.setUserId(2L);

        when(orderRepository.findByIdWithOrderItems(100L)).thenReturn(Optional.of(order));
        when(jwtUtil.getUsernameFromToken(token)).thenReturn("user1");
        when(userRepository.findByUsername("user1")).thenReturn(Optional.of(user));

        mockMvc.perform(get("/api/orders/100").cookie(cookie))
                .andExpect(status().isForbidden());
    }

    // --- 4. Test Update Status ---
    @Test
    void updateOrderStatus_Admin_Success() throws Exception {
        String token = "admin-token";
        Cookie cookie = new Cookie("admin_token", token);

        Order order = new Order();
        order.setId(1L);
        order.setStatus(OrderStatus.PENDING);

        // --- แก้ไขตรงนี้: เพิ่ม List เปล่ากัน NullPointerException ---
        order.setOrderItems(new ArrayList<>());

        when(orderRepository.findByIdWithOrderItems(1L)).thenReturn(Optional.of(order));
        when(jwtUtil.getUsernameFromToken(token)).thenReturn("admin");

        UpdateStatusRequest req = new UpdateStatusRequest();
        req.setStatus(OrderStatus.CANCELLED);

        mockMvc.perform(put("/api/orders/1/status")
                        .cookie(cookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CANCELLED"));

        verify(orderRepository).save(any(Order.class));
    }

    @Test
    void updateOrderStatus_Cancel_Restock() throws Exception {
        String token = "admin-token";
        Cookie cookie = new Cookie("admin_token", token);

        Product p = new Product();
        p.setId(10L);
        p.setStock(10);

        OrderItem item = new OrderItem();
        item.setProduct(p);
        item.setQuantity(5);

        Order order = new Order();
        order.setId(1L);
        order.setStatus(OrderStatus.PENDING);
        order.setOrderItems(List.of(item));

        when(orderRepository.findByIdWithOrderItems(1L)).thenReturn(Optional.of(order));
        when(jwtUtil.getUsernameFromToken(token)).thenReturn("admin");

        UpdateStatusRequest req = new UpdateStatusRequest();
        req.setStatus(OrderStatus.CANCELLED);

        mockMvc.perform(put("/api/orders/1/status")
                        .cookie(cookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());

        assertEquals(15, p.getStock());
        verify(productRepository).save(p);
    }

    // --- 5. Test Delete Order ---
    @Test
    void deleteOrder_Success() throws Exception {
        String token = "user-token";
        Cookie cookie = new Cookie("user_token", token);
        User user = new User();
        user.setId(1L);

        Order order = new Order();
        order.setId(100L);
        order.setUserId(1L);

        when(jwtUtil.getUsernameFromToken(token)).thenReturn("user1");
        when(userRepository.findByUsername("user1")).thenReturn(Optional.of(user));
        when(orderRepository.findById(100L)).thenReturn(Optional.of(order));

        mockMvc.perform(delete("/api/orders/100").cookie(cookie))
                .andExpect(status().isOk());

        verify(orderRepository).deleteById(100L);
    }
}