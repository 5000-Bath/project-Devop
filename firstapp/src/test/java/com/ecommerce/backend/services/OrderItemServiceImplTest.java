package com.ecommerce.backend.services;

import com.ecommerce.backend.models.Order;
import com.ecommerce.backend.models.OrderItem;
import com.ecommerce.backend.models.Product;
import com.ecommerce.backend.repositories.OrderItemRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderItemServiceImplTest {

    @Mock
    private OrderItemRepository orderItemRepository;

    @InjectMocks
    private OrderItemServiceImpl orderItemService;

    @Test
    void getAllOrderItems_Success() {
        when(orderItemRepository.findAll()).thenReturn(List.of(new OrderItem(), new OrderItem()));
        assertEquals(2, orderItemService.getAllOrderItems().size());
    }

    @Test
    void getOrderItemById_Success() {
        OrderItem item = new OrderItem();
        item.setId(1L);
        when(orderItemRepository.findById(1L)).thenReturn(Optional.of(item));

        OrderItem result = orderItemService.getOrderItemById(1L);
        assertEquals(1L, result.getId());
    }

    @Test
    void getOrderItemById_NotFound() {
        when(orderItemRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> orderItemService.getOrderItemById(99L));
    }

    @Test
    void createOrderItem_Success() {
        OrderItem item = new OrderItem();
        when(orderItemRepository.save(any(OrderItem.class))).thenReturn(item);

        assertNotNull(orderItemService.createOrderItem(item));
    }

    @Test
    void updateOrderItem_Success() {
        OrderItem existing = new OrderItem();
        existing.setId(1L);

        when(orderItemRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(orderItemRepository.save(any(OrderItem.class))).thenAnswer(i -> i.getArguments()[0]);

        // จำลองการส่ง Map เข้ามา update
        // ต้องส่ง Object ให้ตรง Type เพราะ Service cast ตรงๆ
        Map<String, Object> updates = Map.of(
                "quantity", 10,
                "order", new Order(),
                "product", new Product()
        );

        OrderItem updated = orderItemService.updateOrderItem(1L, updates);

        assertEquals(10, updated.getQuantity());
        assertNotNull(updated.getOrder());
        assertNotNull(updated.getProduct());
    }

    @Test
    void deleteOrderItem_Success() {
        doNothing().when(orderItemRepository).deleteById(1L);
        orderItemService.deleteOrderItem(1L);
        verify(orderItemRepository, times(1)).deleteById(1L);
    }
}