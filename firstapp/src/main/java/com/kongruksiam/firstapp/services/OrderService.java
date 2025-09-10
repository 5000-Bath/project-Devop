package com.kongruksiam.firstapp.services;

import com.kongruksiam.firstapp.models.Order;
import com.kongruksiam.firstapp.repositories.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }

    public Order updateOrder(Long id, Order orderDetails) {
        Order order = orderRepository.findById(id).orElse(null);
        if (order != null) {
            order.setUser(orderDetails.getUser());
            order.setTotalAmount(orderDetails.getTotalAmount());
            order.setStatus(orderDetails.getStatus());
            order.setItemsJson(orderDetails.getItemsJson());
            order.setShippingName(orderDetails.getShippingName());
            order.setShippingPhone(orderDetails.getShippingPhone());
            order.setShippingAddr(orderDetails.getShippingAddr());
            order.setNote(orderDetails.getNote());
            return orderRepository.save(order);
        }
        return null;
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}