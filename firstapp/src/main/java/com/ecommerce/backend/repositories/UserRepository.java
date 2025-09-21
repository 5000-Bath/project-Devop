package com.ecommerce.backend.repositories;

import com.ecommerce.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}