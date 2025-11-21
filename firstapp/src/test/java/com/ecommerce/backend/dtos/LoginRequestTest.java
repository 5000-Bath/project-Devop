package com.ecommerce.backend.dtos;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class LoginRequestTest {

    @Test
    public void testGettersAndSetters() {
        LoginRequest loginRequest = new LoginRequest();
        String username = "testuser";
        String password = "testpassword";

        loginRequest.setUsername(username);
        loginRequest.setPassword(password);

        assertEquals(username, loginRequest.getUsername());
        assertEquals(password, loginRequest.getPassword());
    }
}
