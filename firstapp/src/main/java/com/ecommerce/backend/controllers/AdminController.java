package com.ecommerce.backend.controllers;

import com.ecommerce.backend.dtos.ProductSaleDto;
import com.ecommerce.backend.dtos.StockReportDto;
import com.ecommerce.backend.models.Admin;
import com.ecommerce.backend.models.Product;
import com.ecommerce.backend.repositories.OrderItemRepository;
import com.ecommerce.backend.repositories.ProductRepository;
import com.ecommerce.backend.services.AdminService;
import com.ecommerce.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admins")
@CrossOrigin(origins = {"http://localhost:3001"}, allowCredentials = "true")
public class AdminController {

    private final AdminRepository adminRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AdminController(AdminRepository adminRepository, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
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
            @RequestBody Map<String, String> body,
            @CookieValue(name = "admin_token", required = false) String token
    ) {
        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Not authenticated"));
        }

        try {
            jwtUtil.getUsernameFromToken(token);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid token"));
        }

        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (body.containsKey("username")) {
            admin.setUsername(body.get("username"));
        }
        if (body.containsKey("email")) {
            admin.setEmail(body.get("email"));
        }
        if (body.containsKey("password") && body.get("password") != null && !body.get("password").isEmpty()) {
            admin.setPassword(passwordEncoder.encode(body.get("password")));
        }

        Admin updated = adminRepository.save(admin);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public void deleteAdmin(@PathVariable Long id) {
        adminService.deleteAdmin(id);
    }
}