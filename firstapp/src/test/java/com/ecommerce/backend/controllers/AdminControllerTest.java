package com.ecommerce.backend.controllers;

import com.ecommerce.backend.models.Admin;
import com.ecommerce.backend.repositories.AdminRepository;
import com.ecommerce.backend.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = AdminController.class, excludeAutoConfiguration = SecurityAutoConfiguration.class)
public class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AdminRepository adminRepository;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private PasswordEncoder passwordEncoder;

    private Admin admin1;
    private Admin admin2;

    @BeforeEach
    void setUp() {
        admin1 = new Admin();
        admin1.setId(1L);
        admin1.setUsername("admin1");
        admin1.setEmail("admin1@example.com");

        admin2 = new Admin();
        admin2.setId(2L);
        admin2.setUsername("admin2");
        admin2.setEmail("admin2@example.com");
    }

    @Test
    void getAllAdmins_shouldReturnListOfAdmins() throws Exception {
        when(adminRepository.findAll()).thenReturn(List.of(admin1, admin2));

        mockMvc.perform(get("/api/admins"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", is(2)))
                .andExpect(jsonPath("$[0].username", is("admin1")))
                .andExpect(jsonPath("$[1].username", is("admin2")));
    }

    @Test
    void getAdminById_whenAdminExists_shouldReturnAdmin() throws Exception {
        when(adminRepository.findById(1L)).thenReturn(Optional.of(admin1));

        mockMvc.perform(get("/api/admins/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username", is("admin1")));
    }

    @Test
    void createAdmin_shouldReturnNewAdmin() throws Exception {
        when(adminRepository.save(any(Admin.class))).thenReturn(admin1);

        mockMvc.perform(post("/api/admins")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\": \"admin1\", \"email\": \"admin1@example.com\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username", is("admin1")));
    }
}
