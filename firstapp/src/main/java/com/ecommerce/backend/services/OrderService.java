package com.ecommerce.backend.services;

import com.ecommerce.backend.controllers.OrderItemRequest;
import com.ecommerce.backend.models.Order;
import com.ecommerce.backend.models.OrderItem;
import com.ecommerce.backend.models.OrderStatus;

import java.util.List;
import java.util.Map;

public interface OrderService {
    List<Order> getAllOrders();
    Order getOrderById(Long id);
    Order createOrder(Order order);
    List<OrderItem> addOrderItems(Long orderId, List<OrderItemRequest> orderItemRequests);
    Order updateOrder(Long id, Map<String, Object> updates);
    void deleteOrder(Long id);
    Order updateOrderStatus(Long id, OrderStatus status);
}
