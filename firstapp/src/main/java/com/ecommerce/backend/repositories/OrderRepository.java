package com.ecommerce.backend.repositories;

import com.ecommerce.backend.models.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}