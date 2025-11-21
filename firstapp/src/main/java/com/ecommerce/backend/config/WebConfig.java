package com.ecommerce.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // ดึงค่า path จาก application.properties
    @Value("${upload.path.images}")
    private String uploadPath;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // ทำให้ URL /uploads/images/** ชี้ไปยังโฟลเดอร์ที่เก็บไฟล์จริงบนเครื่อง
        // "file:" คือ prefix สำหรับการเข้าถึงไฟล์ในระบบ
        registry.addResourceHandler("/uploads/images/**") // URL pattern
                .addResourceLocations("file:" + uploadPath + "/"); // Physical path
    }

}
