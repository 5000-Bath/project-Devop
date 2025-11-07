package com.kongruksiam.firstapp.repositories;

import com.kongruksiam.firstapp.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}