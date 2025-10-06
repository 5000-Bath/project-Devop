package com.ecommerce.backend.controllers;

import com.ecommerce.backend.models.Order;
import com.ecommerce.backend.models.OrderStatus;
import com.ecommerce.backend.models.OrderItem;
import com.ecommerce.backend.models.Product;
import com.ecommerce.backend.repositories.OrderItemRepository;
import com.ecommerce.backend.repositories.OrderRepository;
import com.ecommerce.backend.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        return orderRepository.save(order);
    }

    @PostMapping("/{id}/items")
    public List<OrderItem> addOrderItems(@PathVariable Long id, @RequestBody List<OrderItemRequest> orderItemRequests) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
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
        return orderItemRepository.saveAll(newOrderItems);
    }

    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable Long id) {
        return orderRepository.findByIdWithOrderItems(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable Long id) {
        orderRepository.deleteById(id);
    }

    // ✅ New Endpoint: Update order status
    @PutMapping("/{id}/status")
    public Order updateOrderStatus(@PathVariable Long id, @RequestBody UpdateStatusRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(request.getStatus());
        return orderRepository.save(order);
    }
}
