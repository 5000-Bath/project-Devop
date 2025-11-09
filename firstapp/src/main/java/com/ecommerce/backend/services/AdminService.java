package com.ecommerce.backend.services;

import com.ecommerce.backend.models.Admin;

import java.util.List;
import java.util.Map;

public interface AdminService {
    List<Admin> getAllAdmins();
    Admin getAdminById(Long id);
    Admin getAdminByUsername(String username);
    Admin createAdmin(Admin admin);
    Admin updateAdmin(Long id, Map<String, Object> updates);
    void deleteAdmin(Long id);
}
