package com.kongruksiam.firstapp.repositories;

import com.kongruksiam.firstapp.models.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin, Long> {
}