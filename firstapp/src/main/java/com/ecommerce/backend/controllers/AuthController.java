package com.ecommerce.backend.controllers;

import com.ecommerce.backend.dtos.LoginRequest;
import com.ecommerce.backend.models.Admin;
import com.ecommerce.backend.repositories.AdminRepository;
import com.ecommerce.backend.services.AuthService;
import com.ecommerce.backend.security.JwtUtil;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
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
    private AuthService authService;

    @Autowired
    private AdminRepository adminRepository; // Keep for getMe, or move getMe to AdminService

    @Autowired
    private JwtUtil jwtUtil; // Keep for checkAuth, or move checkAuth to AuthService

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletResponse response) {
        try {
            String token = authService.loginAdmin(request); // Assuming admin login for now
            // If it's a user login, you'd call authService.loginUser(request);

            Admin admin = adminRepository.findByUsername(request.getUsername())
                    .or(() -> adminRepository.findByEmail(request.getUsername()))
                    .orElseThrow(() -> new RuntimeException("Admin not found after login"));

            Cookie cookie = new Cookie("token", token);
            cookie.setHttpOnly(true);
            cookie.setSecure(false); // true ถ้า HTTPS
            cookie.setPath("/");
            cookie.setMaxAge(24 * 60 * 60);
            response.addCookie(cookie);

            return ResponseEntity.ok(new LoginResponse(admin.getUsername(), admin.getId(), admin.getEmail()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        }
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
