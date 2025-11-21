package com.ecommerce.backend.controllers;

import com.ecommerce.backend.models.Admin;
import com.ecommerce.backend.repositories.AdminRepository;
import com.ecommerce.backend.security.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;
import java.util.Optional;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any; // Import ตัวนี้สำคัญมาก
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminAuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AdminAuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean private AdminRepository adminRepository;
    @MockBean private PasswordEncoder passwordEncoder;
    @MockBean private JwtUtil jwtUtil;

    @Test
    void login_Success() throws Exception {
        Admin admin = new Admin();
        admin.setUsername("admin");
        admin.setPassword("encodedPass");

        // --- แก้ตรงนี้: ใช้ any() รับทุกค่า เพื่อกันพลาดเรื่อง String ไม่ตรง ---
        // ไม่ว่าจะส่ง username อะไรมา ก็ให้เจอ admin คนนี้เสมอ
        when(adminRepository.findByUsername(any())).thenReturn(Optional.of(admin));
        // กันเหนียวเผื่อ Controller ไปเรียก findByEmail
        when(adminRepository.findByEmail(any())).thenReturn(Optional.of(admin));

        // รหัสผ่านถูกเสมอ
        when(passwordEncoder.matches(any(), any())).thenReturn(true);

        // Gen Token ได้เสมอ
        when(jwtUtil.generateToken(any())).thenReturn("fake-jwt-token");

        Map<String, String> loginBody = Map.of("username", "admin", "password", "1234");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginBody)))
                .andExpect(status().isOk())
                .andExpect(header().exists("Set-Cookie"))
                .andExpect(jsonPath("$.message").value("Login success"));
    }

    @Test
    void login_Failed_WrongPassword() throws Exception {
        Admin admin = new Admin();
        admin.setUsername("admin");
        admin.setPassword("encodedPass");

        // ใช้ any() เหมือนกัน
        when(adminRepository.findByUsername(any())).thenReturn(Optional.of(admin));
        // แต่รหัสผ่านผิดเสมอ
        when(passwordEncoder.matches(any(), any())).thenReturn(false);

        Map<String, String> loginBody = Map.of("username", "admin", "password", "wrong");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginBody)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void checkAuth_Success() throws Exception {
        String token = "valid-token";
        Cookie cookie = new Cookie("admin_token", token);

        Admin admin = new Admin();
        admin.setUsername("admin");

        when(jwtUtil.getUsernameFromToken(token)).thenReturn("admin");
        when(adminRepository.findByUsername("admin")).thenReturn(Optional.of(admin));

        mockMvc.perform(get("/auth/check").cookie(cookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.authenticated").value(true))
                .andExpect(jsonPath("$.username").value("admin"));
    }

    @Test
    void checkAuth_NoToken() throws Exception {
        mockMvc.perform(get("/auth/check"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("No token"));
    }

    @Test
    void me_Success() throws Exception {
        String token = "valid-token";
        Cookie cookie = new Cookie("admin_token", token);

        Admin admin = new Admin();
        admin.setUsername("admin");
        admin.setEmail("admin@test.com");

        when(jwtUtil.getUsernameFromToken(token)).thenReturn("admin");
        when(adminRepository.findByUsername("admin")).thenReturn(Optional.of(admin));

        mockMvc.perform(get("/auth/me").cookie(cookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.admin.email").value("admin@test.com"));
    }

    @Test
    void logout_Success() throws Exception {
        mockMvc.perform(post("/auth/logout"))
                .andExpect(status().isOk())
                .andExpect(header().exists("Set-Cookie"))
                .andExpect(jsonPath("$.message").value("Logged out"));
    }
}