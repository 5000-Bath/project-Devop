package com.ecommerce.backend.repositories;

import com.ecommerce.backend.models.OrderItem;
import com.ecommerce.backend.dtos.ProductSaleDto;
import com.ecommerce.backend.models.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query("SELECT new com.ecommerce.backend.dtos.ProductSaleDto(oi.product.id, SUM(oi.quantity)) " +
           "FROM OrderItem oi WHERE oi.order.createdAt BETWEEN :startDate AND :endDate " +
           "GROUP BY oi.product.id")
    List<ProductSaleDto> findSalesByProductBetweenDates(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
