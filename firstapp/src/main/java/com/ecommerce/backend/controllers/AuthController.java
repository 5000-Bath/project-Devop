package com.ecommerce.backend.controllers;

import com.ecommerce.backend.dtos.LoginRequest;
import com.ecommerce.backend.models.Admin;
import com.ecommerce.backend.repositories.AdminRepository;
import com.ecommerce.backend.security.JwtUtil;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletResponse response) {

        Admin admin = adminRepository.findByUsername(request.getUsername())
            .or(() -> adminRepository.findByEmail(request.getUsername()))
            .orElse(null);

        if (admin == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "ผู้ใช้ไม่พบ"));
        }

        if (!BCrypt.checkpw(request.getPassword(), admin.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"));
        }

        String token = jwtUtil.generateToken(admin.getUsername());

        Cookie cookie = new Cookie("token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // true ถ้า HTTPS
        cookie.setPath("/");
        cookie.setMaxAge(24 * 60 * 60);
        response.addCookie(cookie);

        return ResponseEntity.ok(new LoginResponse(admin.getUsername(), admin.getId(), admin.getEmail()));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        // ล้าง cookie token
        Cookie cookie = new Cookie("token", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // true ถ้าใช้ HTTPS
        cookie.setPath("/");
        cookie.setMaxAge(0); // ลบ cookie
        response.addCookie(cookie);

        return ResponseEntity.ok(Map.of("message", "Logged out"));
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkAuth(@CookieValue(name = "token", required = false) String token) {
        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token missing");
        }

        try {
            String username = jwtUtil.getUsernameFromToken(token);
            return ResponseEntity.ok(Map.of("username", username));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token invalid or expired");
        }
    }

    @Getter
    @Setter
    @AllArgsConstructor
    static class LoginResponse {
        private String username;
        private Long id;
        private String email;
    }
}
