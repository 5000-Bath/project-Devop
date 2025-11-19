package com.ecommerce.backend;

import com.ecommerce.backend.models.Admin;
import com.ecommerce.backend.repositories.AdminRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;

@Component
public class RehashAdminPasswords implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public RehashAdminPasswords(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        List<Admin> all = adminRepository.findAll();
        for (Admin a : all) {
            String pw = a.getPassword();
            if (pw == null) continue;
            if (!(pw.startsWith("$2a$") || pw.startsWith("$2b$") || pw.startsWith("$2y$"))) {
                String hashed = encoder.encode(pw);
                a.setPassword(hashed);
                adminRepository.save(a);
                System.out.println("Rehashed admin: " + a.getUsername());
            }
        }
    }
}
