package com.ecommerce.backend.controllers;

import com.ecommerce.backend.models.Admin;
import com.ecommerce.backend.repositories.AdminRepository;
import com.ecommerce.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:3001"}, allowCredentials = "true")
public class AdminAuthController {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Autowired
    public AdminAuthController(AdminRepository adminRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String usernameOrEmail = body.getOrDefault("username", "").trim();
        String password = body.getOrDefault("password", "");

        Optional<Admin> adminOpt = adminRepository.findByUsername(usernameOrEmail);
        if (adminOpt.isEmpty()) {
            adminOpt = adminRepository.findByEmail(usernameOrEmail);
        }
        if (adminOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"));
        }
        Admin admin = adminOpt.get();

        if (!passwordEncoder.matches(password, admin.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"));
        }

        String token = jwtUtil.generateToken(admin.getUsername());

        ResponseCookie cookie = ResponseCookie.from("admin_token", token)
                .httpOnly(true)
                .path("/")  
                .maxAge(7 * 24 * 60 * 60) 
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(Map.of("message", "Login success", "admin", admin));
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkAuth(@CookieValue(name = "admin_token", required = false) String token) {
        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "No token", "authenticated", false));
        }
        try {
            String username = jwtUtil.getUsernameFromToken(token);
            Admin admin = adminRepository.findByUsername(username).orElse(null);
            if (admin == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Admin not found", "authenticated", false));
            }
            return ResponseEntity.ok(Map.of(
                "authenticated", true,
                "username", username,
                "admin", admin
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Token invalid or expired", "authenticated", false));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@CookieValue(name = "admin_token", required = false) String token) {
        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "No token"));
        }
        try {
            String username = jwtUtil.getUsernameFromToken(token);
            Admin admin = adminRepository.findByUsername(username).orElse(null);
            if (admin == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Admin not found"));
            }
            return ResponseEntity.ok(Map.of("admin", admin));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Token invalid or expired"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        ResponseCookie clear = ResponseCookie.from("admin_token", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, clear.toString())
                .body(Map.of("message", "Logged out"));
    }
}