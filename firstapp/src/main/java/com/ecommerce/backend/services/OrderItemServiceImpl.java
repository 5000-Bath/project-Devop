package com.ecommerce.backend.services;

import com.ecommerce.backend.models.OrderItem;
import com.ecommerce.backend.repositories.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class OrderItemServiceImpl implements OrderItemService {

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Override
    public List<OrderItem> getAllOrderItems() {
        return orderItemRepository.findAll();
    }

    @Override
    public OrderItem getOrderItemById(Long id) {
        return orderItemRepository.findById(id).orElseThrow(() -> new RuntimeException("OrderItem not found"));
    }

    @Override
    public OrderItem createOrderItem(OrderItem orderItem) {
        return orderItemRepository.save(orderItem);
    }

    @Override
    public OrderItem updateOrderItem(Long id, Map<String, Object> updates) {
        OrderItem orderItem = orderItemRepository.findById(id).orElseThrow(() -> new RuntimeException("OrderItem not found"));

        if (updates.containsKey("order")) {
            // Assuming 'order' is passed as an object or ID that needs to be resolved
            // For simplicity, this example assumes the entire Order object is passed
            // In a real scenario, you might pass orderId and fetch the Order object
            orderItem.setOrder((com.ecommerce.backend.models.Order) updates.get("order"));
        }
        if (updates.containsKey("product")) {
            // Assuming 'product' is passed as an object or ID that needs to be resolved
            orderItem.setProduct((com.ecommerce.backend.models.Product) updates.get("product"));
        }
        if (updates.containsKey("quantity")) {
            orderItem.setQuantity((Integer) updates.get("quantity"));
        }

        return orderItemRepository.save(orderItem);
    }

    @Override
    public void deleteOrderItem(Long id) {
        orderItemRepository.deleteById(id);
    }
}
