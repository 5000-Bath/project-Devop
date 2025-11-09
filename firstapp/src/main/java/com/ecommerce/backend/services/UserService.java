package com.ecommerce.backend.services;

import com.ecommerce.backend.models.User;

import java.util.List;
import java.util.Map;

public interface UserService {
    List<User> getAllUsers();
    User getUserById(Long id);
    User createUser(User user);
    User updateUser(Long id, Map<String, Object> updates);
    void deleteUser(Long id);
}
