package com.ecommerce.backend.controllers;

import com.ecommerce.backend.models.Product;
import com.ecommerce.backend.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

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
            @RequestParam("price") BigDecimal price,
            @RequestParam(value = "stock", required = false, defaultValue = "0") int stock,
            @RequestParam(value = "isActive", required = false, defaultValue = "true") boolean isActive,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        return productService.createProduct(name, description, price, stock, isActive, image);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body
    ) {
        Product updated = productService.updateProduct(id, body);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/quantity/cut")
    public ResponseEntity<?> cutQuantityJson(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> body
    ) {
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
