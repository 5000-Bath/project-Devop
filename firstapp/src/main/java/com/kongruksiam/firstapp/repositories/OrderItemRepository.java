package com.kongruksiam.firstapp.repositories;

import com.kongruksiam.firstapp.models.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}
