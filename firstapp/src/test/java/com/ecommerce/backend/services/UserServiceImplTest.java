package com.ecommerce.backend.services;

import com.ecommerce.backend.models.User;
import com.ecommerce.backend.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setPassword("password");
        user.setEmail("test@example.com");
        user.setName("Test");
        user.setLastname("User");
    }

    @Test
    void testGetAllUsers() {
        when(userRepository.findAll()).thenReturn(Collections.singletonList(user));
        List<User> users = userService.getAllUsers();
        assertFalse(users.isEmpty());
        assertEquals(1, users.size());
        assertEquals(user.getUsername(), users.get(0).getUsername());
    }

    @Test
    void testGetUserById_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        User foundUser = userService.getUserById(1L);
        assertNotNull(foundUser);
        assertEquals(user.getId(), foundUser.getId());
    }

    @Test
    void testGetUserById_NotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());
        Exception exception = assertThrows(RuntimeException.class, () -> {
            userService.getUserById(1L);
        });
        assertEquals("User not found", exception.getMessage());
    }

    @Test
    void testCreateUser() {
        when(userRepository.save(any(User.class))).thenReturn(user);
        User createdUser = userService.createUser(new User());
        assertNotNull(createdUser);
        assertEquals(user.getId(), createdUser.getId());
    }

    @Test
    void testUpdateUser_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        Map<String, Object> updates = new HashMap<>();
        updates.put("username", "newusername");
        updates.put("email", "new@example.com");

        User updatedUser = userService.updateUser(1L, updates);

        assertNotNull(updatedUser);
        assertEquals("newusername", updatedUser.getUsername());
        assertEquals("new@example.com", updatedUser.getEmail());
    }
    
    @Test
    void testUpdateUser_PartialUpdate() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);

        Map<String, Object> updates = new HashMap<>();
        updates.put("name", "UpdatedName");
        updates.put("lastname", "UpdatedLastname");
        updates.put("password", "newPassword");


        User updatedUser = userService.updateUser(1L, updates);

        assertEquals("UpdatedName", updatedUser.getName());
        assertEquals("UpdatedLastname", updatedUser.getLastname());
        assertEquals("newPassword", updatedUser.getPassword());
        // Verify other fields remain unchanged
        assertEquals("testuser", updatedUser.getUsername());
        assertEquals("test@example.com", updatedUser.getEmail());
    }

    @Test
    void testUpdateUser_NotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());
        Map<String, Object> updates = new HashMap<>();
        updates.put("username", "newusername");

        Exception exception = assertThrows(RuntimeException.class, () -> {
            userService.updateUser(1L, updates);
        });
        assertEquals("User not found", exception.getMessage());
    }

    @Test
    void testDeleteUser() {
        doNothing().when(userRepository).deleteById(1L);
        userService.deleteUser(1L);
        verify(userRepository, times(1)).deleteById(1L);
    }
}
