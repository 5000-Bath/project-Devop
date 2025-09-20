package com.kongruksiam.firstapp.repositories;

import com.kongruksiam.firstapp.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}