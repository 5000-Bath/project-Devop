package com.ecommerce.backend.controllers;

import com.ecommerce.backend.models.Admin;
import com.ecommerce.backend.repositories.AdminRepository;
import com.ecommerce.backend.services.AdminService;
import com.ecommerce.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admins")
@CrossOrigin(origins = {"http://localhost:3001"}, allowCredentials = "true")
public class AdminController {

    private final AdminService adminService;
    private final AdminRepository adminRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AdminController(AdminService adminService, AdminRepository adminRepository, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.adminService = adminService;
        this.adminRepository = adminRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public List<Admin> getAllAdmins() {
        return adminService.getAllAdmins();
    }

    @GetMapping("/{id}")
    public Admin getAdminById(@PathVariable Long id) {
        return adminService.getAdminById(id);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe(@CookieValue(name = "admin_token", required = false) String token) {
        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Token missing"));
        }
        try {
            String username = jwtUtil.getUsernameFromToken(token);
            // Admin admin = adminRepository.findByUsername(username) // This line needs to be updated to use AdminService
            //         .orElseThrow(() -> new RuntimeException("Admin not found"));
            // return ResponseEntity.ok(admin);
            // For now, I'll keep the direct repository call for getMe as it's not a standard CRUD operation
            // and requires a specific findByUsername method which might not be in the generic AdminService interface.
            // If findByUsername is needed in AdminService, it should be added there.
            return ResponseEntity.ok(adminService.getAdminByUsername(username));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Token invalid or expired"));
        }
    }

    @PostMapping
    public Admin createAdmin(@RequestBody Admin admin) {
        return adminService.createAdmin(admin);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAdmin(
            @PathVariable Long id, 
            @RequestBody Map<String, Object> body,
            @CookieValue(name = "admin_token", required = false) String token
    ) {
        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Not authenticated"));
        }

        try {
            String currentUsername = jwtUtil.getUsernameFromToken(token);
            Admin admin = adminService.getAdminByUsername(currentUsername);
            if (!admin.getId().equals(id)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Access denied"));
            }

            // เข้ารหัสรหัสผ่านถ้ามีการส่งมาใหม่
            if (body.containsKey("password")) {
                String rawPassword = (String) body.get("password");
                if (rawPassword != null && !rawPassword.isEmpty()) {
                    body.put("password", passwordEncoder.encode(rawPassword));
                } else {
                    body.remove("password"); // ไม่ต้องอัปเดตรหัสผ่านถ้าเป็นค่าว่าง
                }
            }

            Admin updatedAdmin = adminService.updateAdmin(id, body);

            // สร้าง Token ใหม่ถ้า username เปลี่ยน
            String newToken = jwtUtil.generateToken(updatedAdmin.getUsername());
            ResponseCookie cookie = ResponseCookie.from("admin_token", newToken)
                    .httpOnly(true).path("/").maxAge(7 * 24 * 60 * 60).build();

            return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body(updatedAdmin);

        } catch (IllegalStateException e) {
            // ดักจับ Error จาก Service (เช่น username/email ซ้ำ) แล้วส่งกลับเป็น 400
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            // Log error ที่ฝั่ง server แทนการส่งกลับไปหา client โดยตรง
            System.err.println("Admin update failed due to token error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Token invalid or expired. Please login again."));
        }
    }

    @DeleteMapping("/{id}")
    public void deleteAdmin(@PathVariable Long id) {
        adminService.deleteAdmin(id);
    }
}