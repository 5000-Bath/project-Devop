package com.ecommerce.backend.controllers;

import com.ecommerce.backend.models.Product;
import com.ecommerce.backend.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    @PostMapping
    public Product createProduct(
            @RequestParam("name") String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("price") BigDecimal price,
            @RequestParam(value = "stockQty", required = false, defaultValue = "0") int stockQty,
            @RequestParam(value = "isActive", required = false, defaultValue = "true") boolean isActive,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setStockQty(stockQty);
        product.setIsActive(isActive);

        if (image != null && !image.isEmpty()) {
            try {
                // โฟลเดอร์จริงใน container
                String folderPath = "/app/uploads/images/";
                Path path = Paths.get(folderPath);
                if (!Files.exists(path)) {
                    Files.createDirectories(path);
                }

                // สร้างชื่อไฟล์
                String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                Path filePath = path.resolve(fileName);
                image.transferTo(filePath.toFile());

                // ✅ URL สำหรับ frontend / DB
                product.setImageUrl("/uploads/images/" + fileName);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        return productRepository.save(product);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
    }
}
