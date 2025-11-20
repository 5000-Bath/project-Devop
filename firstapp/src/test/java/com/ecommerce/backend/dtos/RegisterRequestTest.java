package com.ecommerce.backend.dtos;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

public class RegisterRequestTest {

    @Test
    public void testGettersAndSetters() {
        RegisterRequest registerRequest = new RegisterRequest();
        String username = "testuser";
        String password = "testpassword";
        String email = "test@example.com";
        String name = "Test";
        String lastname = "User";

        registerRequest.setUsername(username);
        registerRequest.setPassword(password);
        registerRequest.setEmail(email);
        registerRequest.setName(name);
        registerRequest.setLastname(lastname);

        assertEquals(username, registerRequest.getUsername());
        assertEquals(password, registerRequest.getPassword());
        assertEquals(email, registerRequest.getEmail());
        assertEquals(name, registerRequest.getName());
        assertEquals(lastname, registerRequest.getLastname());
    }

    @Test
    public void testEqualsAndHashCode() {
        RegisterRequest request1 = new RegisterRequest();
        request1.setUsername("testuser");
        request1.setPassword("password");
        request1.setEmail("test@test.com");
        request1.setName("name");
        request1.setLastname("lastname");


        RegisterRequest request2 = new RegisterRequest();
        request2.setUsername("testuser");
        request2.setPassword("password");
        request2.setEmail("test@test.com");
        request2.setName("name");
        request2.setLastname("lastname");

        RegisterRequest request3 = new RegisterRequest();
        request3.setUsername("differentuser");
        request3.setPassword("password");
        request3.setEmail("test@test.com");
        request3.setName("name");
        request3.setLastname("lastname");

        assertEquals(request1, request2);
        assertEquals(request1.hashCode(), request2.hashCode());
        assertNotEquals(request1, request3);
        assertNotEquals(request1.hashCode(), request3.hashCode());
    }

    @Test
    public void testToString() {
        RegisterRequest registerRequest = new RegisterRequest();
        String username = "testuser";
        String password = "password";
        String email = "test@test.com";
        String name = "name";
        String lastname = "lastname";

        registerRequest.setUsername(username);
        registerRequest.setPassword(password);
        registerRequest.setEmail(email);
        registerRequest.setName(name);
        registerRequest.setLastname(lastname);

        String expected = "RegisterRequest{"
                + "username='" + username + "'"
                + ", password='" + password + "'"
                + ", email='" + email + "'"
                + ", name='" + name + "'"
                + ", lastname='" + lastname + "'"
                + "}";
        assertEquals(expected, registerRequest.toString());
    }
}
