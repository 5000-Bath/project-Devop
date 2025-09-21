package com.ecommerce.backend.controllers;

import com.ecommerce.backend.models.Product;
import com.ecommerce.backend.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.UrlResource;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.math.BigDecimal;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    // GET all products
    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    // GET product by ID
    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    // POST - Create new product with image upload (multipart/form-data)
    @PostMapping(consumes = "multipart/form-data")
    public Product createProduct(
            @RequestParam("name") String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("price") BigDecimal price,
            @RequestParam(value = "stockQty", required = false, defaultValue = "0") Integer stockQty,
            @RequestParam(value = "isActive", required = false, defaultValue = "true") Boolean isActive,
            @RequestParam(value = "imageUrl", required = false) MultipartFile imageFile
    ) throws IOException {

        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setStockQty(stockQty);
        if (isActive != null) {
            product.setActive(isActive);
        }

        // Handle image upload if provided
        if (imageFile != null && !imageFile.isEmpty()) {
            // ✅ ใช้ absolute path ตรงกับ Docker volume
            String uploadDir = "/app/uploads/images";
            Path uploadPath = Paths.get(uploadDir);

            // สร้างโฟลเดอร์ถ้ายังไม่มี
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFilename = imageFile.getOriginalFilename();
            String fileExtension = "";
            if (originalFilename != null) {
                int lastDot = originalFilename.lastIndexOf('.');
                if (lastDot > 0) {
                    fileExtension = originalFilename.substring(lastDot);
                }
            }

            // ✅ ใช้ UUID เพื่อหลีกเลี่ยงชื่อซ้ำ
            String fileName = UUID.randomUUID().toString() + fileExtension;
            Path filePath = uploadPath.resolve(fileName).normalize();

            // บันทึกไฟล์
            Files.write(filePath, imageFile.getBytes());

            // ✅ คืน URL ที่ WebConfig จัดการไว้
            product.setImageUrl("/uploads/images/" + fileName);
        }

        return productService.createProduct(product);
    }

    // PUT - Update existing product
    @PutMapping("/{id}")
    public Product updateProduct(
            @PathVariable Long id,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "price", required = false) BigDecimal price,
            @RequestParam(value = "stockQty", required = false) Integer stockQty,
            @RequestParam(value = "isActive", required = false) Boolean isActive,
            @RequestParam(value = "imageUrl", required = false) MultipartFile imageFile
    ) throws IOException {

        Product existingProduct = productService.getProductById(id);
        if (existingProduct == null) {
            throw new RuntimeException("Product not found with id: " + id);
        }

        if (name != null) existingProduct.setName(name);
        if (description != null) existingProduct.setDescription(description);
        if (price != null) existingProduct.setPrice(price);
        if (stockQty != null) existingProduct.setStockQty(stockQty);
        if (isActive != null) existingProduct.setActive(isActive);

        // Handle image upload if provided
        if (imageFile != null && !imageFile.isEmpty()) {

            // ✅ ลบภาพเก่าถ้ามี
            if (existingProduct.getImageUrl() != null && !existingProduct.getImageUrl().isEmpty()) {
                try {
                    // ✅ แปลง URL เป็น path จริงใน container: /app/uploads/images/xxx.jpg
                    String oldImagePath = "/app" + existingProduct.getImageUrl(); // เช่น "/app/uploads/images/xxx.jpg"
                    Path oldPath = Paths.get(oldImagePath);
                    if (Files.exists(oldPath)) {
                        Files.delete(oldPath);
                    }
                } catch (IOException e) {
                    System.err.println("Failed to delete old image: " + e.getMessage());
                }
            }

            // ✅ ใช้ absolute path ตรงกับ Docker
            String uploadDir = "/app/uploads/images";
            Path uploadPath = Paths.get(uploadDir);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFilename = imageFile.getOriginalFilename();
            String fileExtension = "";
            if (originalFilename != null) {
                int lastDot = originalFilename.lastIndexOf('.');
                if (lastDot > 0) {
                    fileExtension = originalFilename.substring(lastDot);
                }
            }

            String fileName = UUID.randomUUID().toString() + fileExtension;
            Path filePath = uploadPath.resolve(fileName).normalize();

            Files.write(filePath, imageFile.getBytes());

            existingProduct.setImageUrl("/uploads/images/" + fileName);
        }

        return productService.updateProduct(id, existingProduct);
    }

    // DELETE product
    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }

    // Serve uploaded images
    @GetMapping("/uploads/images/{filename:.+}")
    public ResponseEntity<Resource> serveImage(@PathVariable String filename) {
        try {
            // ✅ ใช้ absolute path ตรงกับที่เก็บจริงใน container
            Path filePath = Paths.get("/app/uploads/images/" + filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                // ✅ ตรวจชนิดไฟล์เพื่อความปลอดภัย
                String contentType = "image/jpeg";
                if (filename.toLowerCase().endsWith(".png")) {
                    contentType = "image/png";
                } else if (filename.toLowerCase().endsWith(".gif")) {
                    contentType = "image/gif";
                } else if (filename.toLowerCase().endsWith(".webp")) {
                    contentType = "image/webp";
                }

                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_TYPE, contentType)
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("Error serving image: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}