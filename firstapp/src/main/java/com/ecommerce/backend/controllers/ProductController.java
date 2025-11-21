package com.ecommerce.backend.controllers;

import com.ecommerce.backend.models.Product;
import com.ecommerce.backend.models.Category; 
import com.ecommerce.backend.repositories.CategoryRepository; 
import com.ecommerce.backend.repositories.ProductRepository;
import com.ecommerce.backend.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    @PostMapping
    public Product createProduct(
            @RequestParam("name") String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("price") String priceStr, // รับเป็น String
            @RequestParam(value = "stock", required = false, defaultValue = "0") int stock,
            @RequestParam(value = "isActive", required = false, defaultValue = "true") boolean isActive,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "category", required = false) String category
    ) {
        // แปลง String เป็น BigDecimal โดยตัดเครื่องหมายจุลภาค (,) ออกก่อน
        BigDecimal price = new BigDecimal(priceStr.replace(",", ""));
        return productService.createProduct(name, description, price, stock, isActive, image, category);
    }

    // ใช้ @PutMapping โดยไม่ระบุ consumes เพื่อให้ยืดหยุ่นและรองรับ Test case ได้
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "price", required = false) String priceStr, // รับเป็น String
            @RequestParam(value = "stock", required = false) Integer stock,
            @RequestParam(value = "isActive", required = false) Boolean isActive,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "category", required = false) String category) {

        // สร้าง Map เพื่อส่งข้อมูลไปให้ Service Layer
        Map<String, Object> updates = new HashMap<>();
        if (name != null) updates.put("name", name);
        if (description != null) updates.put("description", description);
        if (priceStr != null && !priceStr.isEmpty()) {
            // แปลง String เป็น BigDecimal โดยตัดเครื่องหมายจุลภาค (,) ออกก่อน
            updates.put("price", new BigDecimal(priceStr.replace(",", "")));
        }
        if (stock != null) updates.put("stock", stock);
        if (isActive != null) updates.put("isActive", isActive);
        if (image != null && !image.isEmpty()) {
            updates.put("image", image);
        }
        if (category != null) updates.put("category", category);

        if (updates.isEmpty()) {
            return ResponseEntity.badRequest().body("No fields to update");
        }
        
        Product updated = productService.updateProduct(id, updates);
        return ResponseEntity.ok(updated);
    }
    
    @PostMapping("/{id}/quantity/cut")
    public ResponseEntity<?> cutQuantityJson(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> body) {
        int qty = body.getOrDefault("qty", 0);
        try {
            Map<String, Object> result = productService.cutQuantity(id, qty);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.softDeleteProduct(id);
    }
}
