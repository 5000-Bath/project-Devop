package com.ecommerce.backend.controllers;

import com.ecommerce.backend.models.Product;
import com.ecommerce.backend.models.Category; // Corrected import
import com.ecommerce.backend.repositories.CategoryRepository; // Corrected import
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
            @RequestParam("price") BigDecimal price,
            @RequestParam(value = "stock", required = false, defaultValue = "0") int stock,
            @RequestParam(value = "isActive", required = false, defaultValue = "true") boolean isActive,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "categoryId", required = false) Long categoryId
    ) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setStock(stock);
        product.setIsActive(isActive);
        if (categoryId != null) {
            Category category = categoryRepository.findById(categoryId).orElse(null);
            product.setCategory(category);
        }

        if (image != null && !image.isEmpty()) {
            try {
                String folderPath = System.getProperty("java.io.tmpdir") + "/uploads/images/";
                Path path = Paths.get(folderPath);
                if (!Files.exists(path)) {
                    Files.createDirectories(path);
                }

                String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                Path filePath = path.resolve(fileName);
                image.transferTo(filePath.toFile());

                product.setImageUrl("/uploads/images/" + fileName);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return productRepository.save(product);
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
