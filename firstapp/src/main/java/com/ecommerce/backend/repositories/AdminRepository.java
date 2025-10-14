package com.ecommerce.backend.repositories;

import com.ecommerce.backend.models.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {

    // ✅ คืนค่า Optional เพื่อใช้ .or(), .orElse() ได้
    Optional<Admin> findByUsername(String username);

    Optional<Admin> findByEmail(String email);
}
