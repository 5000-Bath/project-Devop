package com.ecommerce.backend.controllers;

import com.ecommerce.backend.dtos.UpdateStatusRequest;
import com.ecommerce.backend.models.Order;
import com.ecommerce.backend.models.OrderItem;
import com.ecommerce.backend.models.OrderStatus;
import com.ecommerce.backend.models.Product;
import com.ecommerce.backend.models.User;
import com.ecommerce.backend.services.OrderService;
import com.ecommerce.backend.repositories.OrderItemRepository;
import com.ecommerce.backend.repositories.OrderRepository;
import com.ecommerce.backend.repositories.ProductRepository;
import com.ecommerce.backend.repositories.UserRepository;
import com.ecommerce.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @PostMapping
    public ResponseEntity<?> createOrder(
            @RequestBody Order order,
            @CookieValue(name = "user_token", required = false) String token
    ) {
        
        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Not authenticated"));
        }

        try {
            String username = jwtUtil.getUsernameFromToken(token);
            User user = userRepository.findByUsername(username).orElse(null);
            
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not found"));
            }

            order.setUserId(user.getId());

            // ส่งต่อให้ Service Layer จัดการทั้งหมด
            Order saved = orderService.createOrder(order);
            return ResponseEntity.ok(saved);
            
        } catch (Exception e) {
            // เปลี่ยนการตอบกลับเพื่อให้เห็นข้อผิดพลาดที่แท้จริง
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/items")
    public ResponseEntity<?> addOrderItems(
            @PathVariable Long id, 
            @RequestBody List<OrderItemRequest> orderItemRequests
    ) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        List<OrderItem> newOrderItems = new ArrayList<>();
        for (OrderItemRequest request : orderItemRequests) {
            Product product = productRepository.findById(request.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + request.getProductId()));
            
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(request.getQuantity());
            newOrderItems.add(orderItem);
        }
        
        List<OrderItem> saved = orderItemRepository.saveAll(newOrderItems);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(
            @PathVariable Long id,
            @CookieValue(name = "user_token", required = false) String userToken,
            @CookieValue(name = "admin_token", required = false) String adminToken
    ) {
        Order order = orderRepository.findByIdWithOrderItems(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));

        // 🟢 1) ถ้าเป็น admin ให้ผ่านทันที
        if (adminToken != null && !adminToken.isEmpty()) {
            try {
                jwtUtil.getUsernameFromToken(adminToken);  // แค่ verify token ใช้ได้ก็พอ
                return ResponseEntity.ok(order);
            } catch (Exception ignore) {
            }
        }

        // 🟡 2) ถ้าไม่ใช่ admin → ทำ logic เดิมเหมือนก่อนแก้
        if (userToken != null && !userToken.isEmpty()) {
            try {
                String username = jwtUtil.getUsernameFromToken(userToken);
                User user = userRepository.findByUsername(username).orElse(null);

                if (user != null) {
                    if (!order.getUserId().equals(user.getId())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body(Map.of("error", "Access denied"));
                    }
                }
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid token"));
            }
        }

        return ResponseEntity.ok(order);
    }

    @GetMapping
    public ResponseEntity<?> getAllOrders(
            @CookieValue(name = "user_token", required = false) String userToken,
            @CookieValue(name = "admin_token", required = false) String adminToken
    ) {

        if (adminToken != null && !adminToken.isEmpty()) {
            try {
                jwtUtil.getUsernameFromToken(adminToken);
                List<Order> allOrders = orderRepository.findAll();
                return ResponseEntity.ok(allOrders); 
            } catch (Exception e) {
            }
        }

        if (userToken == null || userToken.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Not authenticated", "orders", List.of()));
        }

        try {
            String username = jwtUtil.getUsernameFromToken(userToken);
            User user = userRepository.findByUsername(username).orElse(null);
            
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not found", "orders", List.of()));
            }

            List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
            
            return ResponseEntity.ok(orders);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid token", "orders", List.of()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(
            @PathVariable Long id,
            @CookieValue(name = "user_token", required = false) String token
    ) {
        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Not authenticated"));
        }

        try {
            String username = jwtUtil.getUsernameFromToken(token);
            User user = userRepository.findByUsername(username).orElse(null);
            
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not found"));
            }

            Order order = orderRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Order not found"));

            if (!order.getUserId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Access denied"));
            }

            orderRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Deleted successfully"));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid token"));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id, 
            @RequestBody UpdateStatusRequest request,
            @CookieValue(name = "user_token", required = false) String userToken,
            @CookieValue(name = "admin_token", required = false) String adminToken
    ) {
        Order order = orderRepository.findByIdWithOrderItems(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));

        boolean isAuthorized = false;

        if (adminToken != null && !adminToken.isEmpty()) {
            try {
                jwtUtil.getUsernameFromToken(adminToken);
                isAuthorized = true;
            } catch (Exception e) {
            }
        }

        if (!isAuthorized && userToken != null && !userToken.isEmpty()) {
            try {
                String username = jwtUtil.getUsernameFromToken(userToken);
                User user = userRepository.findByUsername(username).orElse(null);
                if (user != null && order.getUserId().equals(user.getId())) {
                    isAuthorized = true;
                }
            } catch (Exception e) {
            }
        }

        if (!isAuthorized) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied"));
        }

        OrderStatus newStatus = request.getStatus();

        if (newStatus == OrderStatus.CANCELLED) {
            for (OrderItem item : order.getOrderItems()) {
                Product product = item.getProduct();
                product.setStock(product.getStock() + item.getQuantity());
                productRepository.save(product);
            }
        }

        order.setStatus(newStatus);
        orderRepository.save(order);

        return ResponseEntity.ok(order);
    }
}