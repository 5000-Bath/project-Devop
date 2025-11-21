package com.ecommerce.backend.services;

import com.ecommerce.backend.dtos.LoginRequest;
import com.ecommerce.backend.dtos.RegisterRequest;
import com.ecommerce.backend.models.Admin;
import com.ecommerce.backend.models.User;
import com.ecommerce.backend.repositories.AdminRepository;
import com.ecommerce.backend.repositories.UserRepository;
import com.ecommerce.backend.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private AdminRepository adminRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthServiceImpl authService;

    // ==========================================
    // 1. Test Register Admin
    // ==========================================
    @Test
    void registerAdmin_Success() {
        // Arrange
        RegisterRequest req = new RegisterRequest();
        req.setUsername("admin");
        req.setEmail("admin@test.com");
        req.setPassword("1234");

        // จำลองว่าไม่ซ้ำ
        when(adminRepository.findByUsername(req.getUsername())).thenReturn(Optional.empty());
        when(adminRepository.findByEmail(req.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(req.getPassword())).thenReturn("encodedPass");

        Admin savedAdmin = new Admin();
        savedAdmin.setUsername(req.getUsername());
        when(adminRepository.save(any(Admin.class))).thenReturn(savedAdmin);

        // Act
        Admin result = authService.registerAdmin(req);

        // Assert
        assertNotNull(result);
        assertEquals("admin", result.getUsername());
        verify(adminRepository, times(1)).save(any(Admin.class));
    }

    @Test
    void registerAdmin_UsernameTaken() {
        RegisterRequest req = new RegisterRequest();
        req.setUsername("admin");

        // จำลองว่ามี User นี้อยู่แล้ว
        when(adminRepository.findByUsername("admin")).thenReturn(Optional.of(new Admin()));

        // Act & Assert
        RuntimeException ex = assertThrows(RuntimeException.class, () -> authService.registerAdmin(req));
        assertEquals("Username is already taken!", ex.getMessage());

        verify(adminRepository, never()).save(any());
    }

    @Test
    void registerAdmin_EmailTaken() {
        RegisterRequest req = new RegisterRequest();
        req.setUsername("admin");
        req.setEmail("admin@test.com");

        when(adminRepository.findByUsername("admin")).thenReturn(Optional.empty());
        when(adminRepository.findByEmail("admin@test.com")).thenReturn(Optional.of(new Admin()));

        RuntimeException ex = assertThrows(RuntimeException.class, () -> authService.registerAdmin(req));
        assertEquals("Email is already taken!", ex.getMessage());
    }

    // ==========================================
    // 2. Test Register User
    // ==========================================
    @Test
    void registerUser_Success() {
        RegisterRequest req = new RegisterRequest();
        req.setUsername("user");
        req.setEmail("user@test.com");
        req.setPassword("1234");
        req.setName("John");
        req.setLastname("Doe");

        when(userRepository.findByUsername(req.getUsername())).thenReturn(Optional.empty());
        when(userRepository.findByEmail(req.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(req.getPassword())).thenReturn("encodedPass");

        User savedUser = new User();
        savedUser.setUsername(req.getUsername());
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        User result = authService.registerUser(req);

        assertNotNull(result);
        assertEquals("user", result.getUsername());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void registerUser_UsernameTaken() {
        RegisterRequest req = new RegisterRequest();
        req.setUsername("user");

        when(userRepository.findByUsername("user")).thenReturn(Optional.of(new User()));

        RuntimeException ex = assertThrows(RuntimeException.class, () -> authService.registerUser(req));
        assertEquals("Username is already taken!", ex.getMessage());
    }

    @Test
    void registerUser_EmailTaken() {
        RegisterRequest req = new RegisterRequest();
        req.setUsername("user");
        req.setEmail("user@test.com");

        when(userRepository.findByUsername("user")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(new User()));

        RuntimeException ex = assertThrows(RuntimeException.class, () -> authService.registerUser(req));
        assertEquals("Email is already taken!", ex.getMessage());
    }

    // ==========================================
    // 3. Test Login
    // ==========================================
    @Test
    void loginAdmin_Success() {
        LoginRequest req = new LoginRequest();
        req.setUsername("admin");
        req.setPassword("1234");

        // จำลองการทำงานของ AuthenticationManager (ผ่านตลอด)
        Authentication mockAuth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(mockAuth);

        // จำลองการสร้าง Token
        when(jwtUtil.generateToken("admin")).thenReturn("mock-jwt-token");

        String token = authService.loginAdmin(req);

        assertEquals("mock-jwt-token", token);
        // เช็คว่ามีการเรียก authenticate จริง
        verify(authenticationManager, times(1)).authenticate(any());
    }

    @Test
    void loginUser_Success() {
        LoginRequest req = new LoginRequest();
        req.setUsername("user");
        req.setPassword("1234");

        Authentication mockAuth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(mockAuth);

        when(jwtUtil.generateToken("user")).thenReturn("mock-jwt-token");

        String token = authService.loginUser(req);

        assertEquals("mock-jwt-token", token);
        verify(authenticationManager, times(1)).authenticate(any());
    }
}