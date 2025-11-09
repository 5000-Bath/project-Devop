package com.ecommerce.backend.services;

import com.ecommerce.backend.models.OrderItem;

import java.util.List;
import java.util.Map;

public interface OrderItemService {
    List<OrderItem> getAllOrderItems();
    OrderItem getOrderItemById(Long id);
    OrderItem createOrderItem(OrderItem orderItem);
    OrderItem updateOrderItem(Long id, Map<String, Object> updates);
    void deleteOrderItem(Long id);
}
