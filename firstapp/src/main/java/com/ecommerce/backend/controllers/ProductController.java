package com.ecommerce.backend.controllers;

import com.ecommerce.backend.models.Product;
import com.ecommerce.backend.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;

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
                String folderPath = "/app/uploads/images/";
                Path path = Paths.get(folderPath);
                if (!Files.exists(path)) {
                    Files.createDirectories(path);
                }

                String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                Path filePath = path.resolve(fileName);
                image.transferTo(filePath.toFile());

                product.setImageUrl("/uploads/images/" + fileName);
            } catch (Exception e) {
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
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (body.containsKey("name")) {
            product.setName((String) body.get("name"));
        }

        if (body.containsKey("description")) {
            product.setDescription((String) body.get("description"));
        }

        if (body.containsKey("price")) {
            Object priceObj = body.get("price");
            if (priceObj != null) {
                product.setPrice(new BigDecimal(priceObj.toString()));
            }
        }

        if (body.containsKey("stockQty")) {
            Object qtyObj = body.get("stockQty");
            if (qtyObj != null) {
                product.setStockQty(Integer.parseInt(qtyObj.toString()));
            }
        }

        Product updated = productRepository.save(product);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/quantity/cut")
    public ResponseEntity<?> cutQuantityJson(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> body
    ) {
        int qty = body.getOrDefault("qty", 0);

        Product p = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (qty <= 0) {
            return ResponseEntity.badRequest().body("qty must be > 0");
        }
        if (p.getStockQty() < qty) {
            return ResponseEntity.badRequest().body("insufficient stock");
        }

        p.setStockQty(p.getStockQty() - qty);
        productRepository.save(p);

        return ResponseEntity.ok(Map.of(
                "id", p.getId(),
                "deducted", qty,
                "remainingQty", p.getStockQty()
        ));
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
    }
}
