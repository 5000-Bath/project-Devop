package com.ecommerce.backend.services;

import com.ecommerce.backend.models.Admin;
import com.ecommerce.backend.repositories.AdminRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map; // เพิ่มตัวนี้
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminServiceImplTest {

    @Mock
    private AdminRepository adminRepository;

    @InjectMocks
    private AdminServiceImpl adminService;

    @Test
    void getAllAdmins_Success() {
        when(adminRepository.findAll()).thenReturn(List.of(new Admin(), new Admin()));
        assertEquals(2, adminService.getAllAdmins().size());
    }

    @Test
    void getAdminById_Success() {
        Admin admin = new Admin();
        admin.setId(1L);
        when(adminRepository.findById(1L)).thenReturn(Optional.of(admin));
        assertEquals(1L, adminService.getAdminById(1L).getId());
    }

    @Test
    void updateAdmin_Success() {
        Admin existing = new Admin();
        existing.setId(1L);

        when(adminRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(adminRepository.save(any(Admin.class))).thenAnswer(i -> i.getArguments()[0]);

        // --- แก้ตรงนี้ครับ: เปลี่ยนเป็นส่ง Map แทน Admin Object ---
        Map<String, Object> updates = Map.of("username", "NewAdminName");

        Admin result = adminService.updateAdmin(1L, updates);
        assertNotNull(result);
    }

    @Test
    void deleteAdmin_Success() {
        doNothing().when(adminRepository).deleteById(1L);
        adminService.deleteAdmin(1L);
        verify(adminRepository, times(1)).deleteById(1L);
    }
}