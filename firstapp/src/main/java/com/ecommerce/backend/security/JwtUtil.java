package com.ecommerce.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // ต้องยาว >= 64 ตัวอักษร (512 bits) สำหรับ HS512
    @Value("${jwt.secret:ThisIsAVeryLongSecretKeyForHS512AlgorithmAtLeast64Chars!12345gggddddd67890}")
    private String secret;

    private final long expirationMs = 86400000; // 1 วัน

    private Key getSigningKey() {
        // ใช้ HMAC-SHA key สำหรับ HS512
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }
}
