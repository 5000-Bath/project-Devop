package com.ecommerce.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // ✅ ปล่อย preflight ทุก path (React ต้องใช้)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // ✅ ปล่อย endpoint ที่ใช้ login
                        .requestMatchers("/auth/**", "/api/auth/**").permitAll()

                        // ✅ ปล่อย public GET เช่น สินค้า, รูปภาพ
                        .requestMatchers(HttpMethod.GET, "/api/products/**", "/uploads/images/**").permitAll()

                        // ✅ ปล่อยทุกอย่างก่อน (debug)
                        .anyRequest().permitAll()
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList(
                "https://foodstore.weerapatserver.com",
                "https://rayong.weerapatserver.com",
                "https://salaya.weerapatserver.com",
                "https://adminrayong.weerapatserver.com",
                "https://adminsalaya.weerapatserver.com",
                "https://adminfoodstore.weerapatserver.com",
                "http://localhost:3000", "http://127.0.0.1:3000",
                "http://localhost:3001", "http://127.0.0.1:3001",
                "http://localhost:5173", "http://127.0.0.1:5173",
                "http://localhost:4173", "http://127.0.0.1:4173",
                "http://10.10.10.8:31001","http://192.168.31.232:31001"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization","Content-Type","Accept","Origin","X-Requested-With"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
