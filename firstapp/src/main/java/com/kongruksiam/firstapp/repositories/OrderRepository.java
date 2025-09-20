package com.kongruksiam.firstapp.repositories;

import com.kongruksiam.firstapp.models.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}