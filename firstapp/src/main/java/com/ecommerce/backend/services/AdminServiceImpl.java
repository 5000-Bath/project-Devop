package com.ecommerce.backend.services;

import com.ecommerce.backend.models.Admin;
import com.ecommerce.backend.repositories.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    @Override
    public Admin getAdminById(Long id) {
        return adminRepository.findById(id).orElseThrow(() -> new RuntimeException("Admin not found"));
    }

    @Override
    public Admin getAdminByUsername(String username) {
        return adminRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
    }

    @Override
    public Admin createAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    @Override
    public Admin updateAdmin(Long id, Map<String, Object> updates) {
        Admin admin = adminRepository.findById(id).orElseThrow(() -> new RuntimeException("Admin not found"));

        if (updates.containsKey("username")) {
            String newUsername = (String) updates.get("username");
            // ตรวจสอบว่า username ใหม่ซ้ำกับคนอื่นหรือไม่ (ที่ไม่ใช่ตัวเอง)
            adminRepository.findByUsername(newUsername).ifPresent(existingAdmin -> {
                if (!existingAdmin.getId().equals(id)) {
                    throw new IllegalStateException("Username '" + "' is already taken.");
                }
            });
            admin.setUsername(newUsername);
        }
        if (updates.containsKey("email")) {
            String newEmail = (String) updates.get("email");
            // ตรวจสอบว่า email ใหม่ซ้ำกับคนอื่นหรือไม่ (ที่ไม่ใช่ตัวเอง)
            adminRepository.findByEmail(newEmail).ifPresent(existingAdmin -> {
                if (!existingAdmin.getId().equals(id)) {
                    throw new IllegalStateException("Email '" + "' is already taken.");
                }
            });
            admin.setEmail(newEmail);
        }
        if (updates.containsKey("password")) {
            admin.setPassword((String) updates.get("password"));
        }

        return adminRepository.save(admin);
    }

    @Override
    public void deleteAdmin(Long id) {
        adminRepository.deleteById(id);
    }
}
