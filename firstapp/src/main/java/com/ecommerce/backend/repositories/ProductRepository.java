package com.ecommerce.backend.repositories;

import com.ecommerce.backend.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    @Modifying
    @Transactional
    @Query("UPDATE Product p SET p.isActive = false, p.deletedAt = CURRENT_TIMESTAMP WHERE p.id = :id")
    void softDeleteById(@Param("id") Long id);

    List<Product> findByIsActiveTrue();
}

