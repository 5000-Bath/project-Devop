package com.ecommerce.backend.services;

import com.ecommerce.backend.controllers.OrderItemRequest;
import com.ecommerce.backend.models.Order;
import com.ecommerce.backend.models.OrderItem;
import com.ecommerce.backend.models.CouponUsageLog;
import com.ecommerce.backend.models.OrderStatus;
import com.ecommerce.backend.models.Product;
import com.ecommerce.backend.repositories.OrderItemRepository;
import com.ecommerce.backend.repositories.OrderRepository;
import com.ecommerce.backend.repositories.CouponUsageLogRepository;
import com.ecommerce.backend.repositories.ProductRepository;
import com.ecommerce.backend.services.CouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private CouponUsageLogRepository couponUsageLogRepository;

    @Autowired
    private CouponService couponService;

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    private void linkCouponLogToOrder(Order order) {
        if (order.getUserId() == null || order.getCouponCode() == null || order.getCouponCode().isEmpty()) {
            return;
        }
        List<CouponUsageLog> logs = couponUsageLogRepository.findUnlinkedByUserIdAndCouponCode(order.getUserId(), order.getCouponCode());
        for (CouponUsageLog log : logs) {
            log.setOrder(order);
            couponUsageLogRepository.save(log);
        }
    }

    @Override
    public Order getOrderById(Long id) {
        return orderRepository.findByIdWithOrderItems(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    @Override
    public Order createOrder(Order order) {
        Order savedOrder = orderRepository.save(order);
        if (savedOrder.getCouponCode() != null && !savedOrder.getCouponCode().isEmpty()) {
            couponService.applyCouponToOrder(savedOrder);
        }
        return savedOrder;
    }

    @Override
    public List<OrderItem> addOrderItems(Long orderId, List<OrderItemRequest> orderItemRequests) {
        Order order = orderRepository.findById(orderId)
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
        return orderItemRepository.saveAll(newOrderItems);
    }

    @Override
    public Order updateOrder(Long id, Map<String, Object> updates) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));

        if (updates.containsKey("userId")) {
            order.setUserId((Long) updates.get("userId"));
        }
        if (updates.containsKey("status")) {
            order.setStatus(OrderStatus.valueOf((String) updates.get("status")));
        }

        return orderRepository.save(order);
    }

    @Override
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    @Override
    public Order updateOrderStatus(Long id, OrderStatus status) {
        Order order = orderRepository.findByIdWithOrderItems(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // ✅ ถ้า CANCELLED → คืน stock กลับ
        if (status == OrderStatus.CANCELLED) {
            for (OrderItem item : order.getOrderItems()) {
                Product product = item.getProduct();
                product.setStock(product.getStock() + item.getQuantity());
                productRepository.save(product);
            }
        }

        // ✅ ถ้า SUCCESS → ไม่ทำอะไรกับ stock (เพราะ stock ถูกลดไปตอน user สั่งแล้ว)
        // ✅ แค่เปลี่ยนสถานะตามปกติ
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
