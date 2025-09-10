package com.kongruksiam.firstapp.services;

import com.kongruksiam.firstapp.models.Admin;
import com.kongruksiam.firstapp.repositories.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    public Admin getAdminById(Long id) {
        return adminRepository.findById(id).orElse(null);
    }

    public Admin createAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    public Admin updateAdmin(Long id, Admin adminDetails) {
        Admin admin = adminRepository.findById(id).orElse(null);
        if (admin != null) {
            admin.setUsername(adminDetails.getUsername());
            admin.setEmail(adminDetails.getEmail());
            if (adminDetails.getPassword() != null && !adminDetails.getPassword().isEmpty()) {
                admin.setPassword(adminDetails.getPassword()); // Ideally, hash this password
            }
            return adminRepository.save(admin);
        }
        return null;
    }

    public void deleteAdmin(Long id) {
        adminRepository.deleteById(id);
    }
}