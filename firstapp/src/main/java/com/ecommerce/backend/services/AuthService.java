package com.ecommerce.backend.services;

import com.ecommerce.backend.dtos.LoginRequest;
import com.ecommerce.backend.dtos.RegisterRequest;
import com.ecommerce.backend.models.Admin;
import com.ecommerce.backend.models.User;

public interface AuthService {
    Admin registerAdmin(RegisterRequest registerRequest);
    User registerUser(RegisterRequest registerRequest);
    String loginAdmin(LoginRequest loginRequest);
    String loginUser(LoginRequest loginRequest);
}
