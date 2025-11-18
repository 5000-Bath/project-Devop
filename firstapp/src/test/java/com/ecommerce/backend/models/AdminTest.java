package com.ecommerce.backend.models;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class AdminTest {

    @Test
    void setPassword_withRawPassword_shouldStoreHashedPassword() {
        Admin admin = new Admin();
        String rawPassword = "password123";

        admin.setPassword(rawPassword);

        String storedPassword = admin.getPassword();

        assertNotNull(storedPassword);
        assertNotEquals(rawPassword, storedPassword);
        assertTrue(storedPassword.startsWith("$2a$"));
    }

    @Test
    void setPassword_withAlreadyHashedPassword_shouldNotRehash() {
        Admin admin = new Admin();
        String hashedPassword = "$2a$10$e.Ex.OM2Co5bK53zB2Nn9uXJt.9p/i5.XgJ3e.a.9O/1.a.9O/1.a"; // Example hash

        admin.setPassword(hashedPassword);

        assertEquals(hashedPassword, admin.getPassword());
    }

    @Test
    void setPassword_withNullPassword_shouldStoreNull() {
        Admin admin = new Admin();
        admin.setPassword(null);

        assertNull(admin.getPassword());
    }
}
