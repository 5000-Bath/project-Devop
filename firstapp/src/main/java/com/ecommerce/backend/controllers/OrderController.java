package com.ecommerce.backend.controllers;

import com.ecommerce.backend.dtos.UpdateStatusRequest;
import com.ecommerce.backend.models.Order;
import com.ecommerce.backend.models.OrderItem;
import com.ecommerce.backend.models.OrderStatus;
import com.ecommerce.backend.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        return orderService.createOrder(order);
    }

    @PostMapping("/{id}/items")
    public List<OrderItem> addOrderItems(@PathVariable Long id, @RequestBody List<OrderItemRequest> orderItemRequests) {
        return orderService.addOrderItems(id, orderItemRequests);
    }

    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody UpdateStatusRequest request) {
        Order updatedOrder = orderService.updateOrderStatus(id, request.getStatus());
        return ResponseEntity.ok(updatedOrder);
    }
}
