package com.ecommerce.backend.controllers;

import com.ecommerce.backend.models.Admin;
import com.ecommerce.backend.repositories.AdminRepository;
import com.ecommerce.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admins")
public class AdminController {

    private final AdminRepository adminRepository;

    private final JwtUtil jwtUtil;

    public AdminController(AdminRepository adminRepository, JwtUtil jwtUtil) {
        this.adminRepository = adminRepository;
        this.jwtUtil = jwtUtil;
    }

    // ดึงข้อมูล Admin ทั้งหมด
    @GetMapping
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    // ดึง Admin ตาม ID
    @GetMapping("/{id}")
    public Admin getAdminById(@PathVariable Long id) {
        return adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
    }

    // ดึงข้อมูลตัวเองจาก token
    @GetMapping("/me")

    public ResponseEntity<?> getMe(@CookieValue(name = "token", required = false) String token) {
        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token missing");
        }
        try {
            String username = jwtUtil.getUsernameFromToken(token);
            Admin admin = adminRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Admin not found"));
            return ResponseEntity.ok(admin);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token invalid or expired");
        }
    }

    // สร้าง Admin ใหม่
    @PostMapping
    public Admin createAdmin(@RequestBody Admin admin) {
        return adminRepository.save(admin);
    }

    // แก้ไข Admin
    @PutMapping("/{id}")
    public Admin updateAdmin(@PathVariable Long id, @RequestBody Admin adminDetails) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (adminDetails.getUsername() != null) admin.setUsername(adminDetails.getUsername());
        if (adminDetails.getPassword() != null) admin.setPassword(adminDetails.getPassword());
        if (adminDetails.getEmail() != null) admin.setEmail(adminDetails.getEmail());

        return adminRepository.save(admin);
    }

    // ลบ Admin
    @DeleteMapping("/{id}")
    public void deleteAdmin(@PathVariable Long id) {
        adminRepository.deleteById(id);
    }
}
