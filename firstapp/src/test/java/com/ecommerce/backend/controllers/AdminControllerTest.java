package com.ecommerce.backend.controllers;

import com.ecommerce.backend.models.Admin;
import com.ecommerce.backend.repositories.AdminRepository;
import com.ecommerce.backend.security.JwtUtil;
import com.ecommerce.backend.services.AdminService;
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

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminController.class)
@AutoConfigureMockMvc(addFilters = false) // ปิด Security ชั่วคราว
class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // Mock ของทั้งหมดที่ Controller เรียกใช้
    @MockBean
    private AdminService adminService;

    @MockBean
    private AdminRepository adminRepository; // จำเป็นเพราะ updateAdmin เรียกใช้ตรงๆ

    @MockBean
    private JwtUtil jwtUtil; // จำเป็นสำหรับ /me และ updateAdmin

    @MockBean
    private PasswordEncoder passwordEncoder; // จำเป็นสำหรับ updateAdmin

    // --- 1. Test GET All ---
    @Test
    void getAllAdmins_Success() throws Exception {
        when(adminService.getAllAdmins()).thenReturn(List.of(new Admin(), new Admin()));

        mockMvc.perform(get("/api/admins"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    // --- 2. Test GET By ID ---
    @Test
    void getAdminById_Success() throws Exception {
        Admin admin = new Admin();
        admin.setId(1L);
        when(adminService.getAdminById(1L)).thenReturn(admin);

        mockMvc.perform(get("/api/admins/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    // --- 3. Test GET /me (เช็ค Cookie) ---
    @Test
    void getMe_Success() throws Exception {
        // จำลอง Token และ User
        String token = "valid-token";
        Cookie cookie = new Cookie("admin_token", token);

        Admin admin = new Admin();
        admin.setUsername("admin01");

        when(jwtUtil.getUsernameFromToken(token)).thenReturn("admin01");
        when(adminService.getAdminByUsername("admin01")).thenReturn(admin);

        mockMvc.perform(get("/api/admins/me").cookie(cookie)) // ส่ง Cookie ไปด้วย
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("admin01"));
    }

    @Test
    void getMe_Unauthorized_NoToken() throws Exception {
        mockMvc.perform(get("/api/admins/me")) // ไม่ส่ง Cookie
                .andExpect(status().isUnauthorized());
    }

    // --- 4. Test Create ---
    @Test
    void createAdmin_Success() throws Exception {
        Admin admin = new Admin();
        admin.setUsername("newAdmin");

        when(adminService.createAdmin(any(Admin.class))).thenReturn(admin);

        mockMvc.perform(post("/api/admins")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(admin)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("newAdmin"));
    }

    // --- 5. Test Update (จุดปราบเซียนที่มี Logic ใน Controller) ---
    @Test
    void updateAdmin_Success() throws Exception {
        String token = "valid-token";
        Cookie cookie = new Cookie("admin_token", token);

        // ข้อมูลที่จะแก้
        Map<String, String> updates = Map.of(
                "username", "updatedName",
                "password", "newPass123"
        );

        // ข้อมูลเดิมใน DB
        Admin existingAdmin = new Admin();
        existingAdmin.setId(1L);
        existingAdmin.setUsername("oldName");

        // Mock Process ทั้งหมด
        when(jwtUtil.getUsernameFromToken(token)).thenReturn("adminUser"); // ผ่าน Token check
        when(adminRepository.findById(1L)).thenReturn(Optional.of(existingAdmin)); // เจอ Admin
        when(passwordEncoder.encode("newPass123")).thenReturn("encodedPass"); // เข้ารหัสผ่าน
        when(adminRepository.save(any(Admin.class))).thenAnswer(i -> i.getArguments()[0]); // บันทึก

        mockMvc.perform(put("/api/admins/1")
                        .cookie(cookie) // อย่าลืม Cookie
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updates)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("updatedName")); // เช็คว่าเปลี่ยนจริง
    }

    @Test
    void updateAdmin_Unauthorized() throws Exception {
        Map<String, String> updates = Map.of("username", "hacker");

        mockMvc.perform(put("/api/admins/1")
                        // ไม่ส่ง Cookie
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updates)))
                .andExpect(status().isUnauthorized());
    }

    // --- 6. Test Delete ---
    @Test
    void deleteAdmin_Success() throws Exception {
        doNothing().when(adminService).deleteAdmin(1L);

        mockMvc.perform(delete("/api/admins/1"))
                .andExpect(status().isOk());

        verify(adminService, times(1)).deleteAdmin(1L);
    }
}