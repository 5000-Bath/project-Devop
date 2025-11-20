package com.ecommerce.backend.services;

import com.ecommerce.backend.controllers.OrderItemRequest;
import com.ecommerce.backend.models.Order;
import com.ecommerce.backend.models.OrderItem;
import com.ecommerce.backend.models.OrderStatus;
import com.ecommerce.backend.models.Product;
import com.ecommerce.backend.repositories.CouponUsageLogRepository;
import com.ecommerce.backend.repositories.OrderItemRepository;
import com.ecommerce.backend.repositories.OrderRepository;
import com.ecommerce.backend.repositories.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class OrderServiceImplTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    @Mock
    private CouponUsageLogRepository couponUsageLogRepository;

    @Mock
    private CouponService couponService;

    @InjectMocks
    private OrderServiceImpl orderService;

    private Order order;
    private Product product;
    private OrderItem orderItem;

    @BeforeEach
    void setUp() {
        order = new Order();
        order.setId(1L);
        order.setUserId(1L);
        order.setStatus(OrderStatus.PENDING);

        product = new Product();
        product.setId(1L);
        product.setName("Test Product");
        product.setPrice(BigDecimal.valueOf(100));
        product.setStock(10);

        orderItem = new OrderItem();
        orderItem.setProduct(product);
        orderItem.setQuantity(2);
        order.setOrderItems(Collections.singletonList(orderItem));
    }

    @Test
    void testGetAllOrders() {
        when(orderRepository.findAll()).thenReturn(Collections.singletonList(order));
        List<Order> orders = orderService.getAllOrders();
        assertFalse(orders.isEmpty());
        assertEquals(1, orders.size());
    }

    @Test
    void testGetOrderById_Success() {
        when(orderRepository.findByIdWithOrderItems(1L)).thenReturn(Optional.of(order));
        Order foundOrder = orderService.getOrderById(1L);
        assertNotNull(foundOrder);
        assertEquals(1L, foundOrder.getId());
    }

    @Test
    void testGetOrderById_NotFound() {
        when(orderRepository.findByIdWithOrderItems(1L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> orderService.getOrderById(1L));
    }

    @Test
    void testCreateOrder_NoCoupon() {
        when(orderRepository.save(any(Order.class))).thenReturn(order);
        Order createdOrder = orderService.createOrder(order);
        assertNotNull(createdOrder);
        verify(couponService, never()).applyCouponToOrder(any(Order.class));
    }

    @Test
    void testCreateOrder_WithCoupon() {
        order.setCouponCode("DISCOUNT10");
        when(orderRepository.save(any(Order.class))).thenReturn(order);
        orderService.createOrder(order);
        verify(couponService, times(1)).applyCouponToOrder(order);
    }

    @Test
    void testAddOrderItems_Success() {
        OrderItemRequest itemRequest = new OrderItemRequest();
        itemRequest.setProductId(1L);
        itemRequest.setQuantity(1);
        List<OrderItemRequest> requests = Collections.singletonList(itemRequest);

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(orderItemRepository.saveAll(anyList())).thenReturn(Collections.singletonList(new OrderItem()));

        List<OrderItem> newItems = orderService.addOrderItems(1L, requests);
        assertFalse(newItems.isEmpty());
    }

    @Test
    void testAddOrderItems_OrderNotFound() {
        when(orderRepository.findById(1L)).thenReturn(Optional.empty());
        List<OrderItemRequest> requests = new ArrayList<>();
        assertThrows(RuntimeException.class, () -> orderService.addOrderItems(1L, requests));
    }

    @Test
    void testAddOrderItems_ProductNotFound() {
        OrderItemRequest itemRequest = new OrderItemRequest();
        itemRequest.setProductId(1L);
        itemRequest.setQuantity(1);
        List<OrderItemRequest> requests = Collections.singletonList(itemRequest);

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> orderService.addOrderItems(1L, requests));
    }

    @Test
    void testUpdateOrder_Success() {
        Map<String, Object> updates = new HashMap<>();
        updates.put("status", "SUCCESS");
        updates.put("userId", 2L);

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        Order updatedOrder = orderService.updateOrder(1L, updates);
        assertEquals(OrderStatus.SUCCESS, updatedOrder.getStatus());
        assertEquals(2L, updatedOrder.getUserId());
    }

    @Test
    void testUpdateOrder_NotFound() {
        when(orderRepository.findById(1L)).thenReturn(Optional.empty());
        Map<String, Object> updates = new HashMap<>();
        assertThrows(RuntimeException.class, () -> orderService.updateOrder(1L, updates));
    }

    @Test
    void testDeleteOrder() {
        doNothing().when(orderRepository).deleteById(1L);
        orderService.deleteOrder(1L);
        verify(orderRepository, times(1)).deleteById(1L);
    }

    @Test
    void testUpdateOrderStatus_Cancelled() {
        when(orderRepository.findByIdWithOrderItems(1L)).thenReturn(Optional.of(order));
        when(productRepository.save(any(Product.class))).thenReturn(product);
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        int initialStock = product.getStock();
        orderService.updateOrderStatus(1L, OrderStatus.CANCELLED);

        assertEquals(initialStock + orderItem.getQuantity(), product.getStock());
        assertEquals(OrderStatus.CANCELLED, order.getStatus());
    }

    @Test
    void testUpdateOrderStatus_Success() {
        when(orderRepository.findByIdWithOrderItems(1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        int initialStock = product.getStock();
        orderService.updateOrderStatus(1L, OrderStatus.SUCCESS);

        assertEquals(initialStock, product.getStock());
        assertEquals(OrderStatus.SUCCESS, order.getStatus());
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void testUpdateOrderStatus_OrderNotFound() {
        when(orderRepository.findByIdWithOrderItems(1L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> orderService.updateOrderStatus(1L, OrderStatus.SUCCESS));
    }
}
