package com.ecommerce.backend.controllers;

import com.ecommerce.backend.models.User;
import com.ecommerce.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody Map<String, Object> userDetails) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        if (userDetails.containsKey("username")) {
            user.setUsername((String) userDetails.get("username"));
        }
        if (userDetails.containsKey("password")) {
            user.setPassword((String) userDetails.get("password"));
        }
        if (userDetails.containsKey("email")) {
            user.setEmail((String) userDetails.get("email"));
        }
        if (userDetails.containsKey("name")) {
            user.setName((String) userDetails.get("name"));
        }
        if (userDetails.containsKey("lastname")) {
            user.setLastname((String) userDetails.get("lastname"));
        }

        return userRepository.save(user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
    }
}