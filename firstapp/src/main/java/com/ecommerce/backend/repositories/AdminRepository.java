package com.ecommerce.backend.repositories;

import com.ecommerce.backend.models.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin, Long> {
}