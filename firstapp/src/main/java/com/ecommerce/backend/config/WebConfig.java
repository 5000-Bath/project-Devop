package com.ecommerce.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // ✅ Config ให้เข้าถึงไฟล์อัปโหลดได้
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/images/**")
                .addResourceLocations("file:/app/uploads/images/"); // ✅ แก้เป็น absolute path!
    }

}
