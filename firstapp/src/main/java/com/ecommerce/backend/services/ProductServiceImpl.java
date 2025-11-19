package com.ecommerce.backend.services;

import com.ecommerce.backend.models.Product;
import com.ecommerce.backend.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findByIsActiveTrue();
    }

    @Override
    public Product getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        if (!product.getIsActive()) {
            throw new RuntimeException("Product not found");
        }
        return product;
    }

    @Override
    public Product createProduct(String name, String description, BigDecimal price, int stock, boolean isActive, MultipartFile image) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setStock(stock);
        product.setIsActive(isActive);
        product.setCreatedAt(LocalDateTime.now()); // Set creation timestamp

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

    @Override
    public Product updateProduct(Long id, Map<String, Object> updates) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (updates.containsKey("name")) {
            product.setName((String) updates.get("name"));
        }
        if (updates.containsKey("description")) {
            product.setDescription((String) updates.get("description"));
        }
        if (updates.containsKey("price")) {
            Object priceObj = updates.get("price");
            if (priceObj != null) {
                product.setPrice(new BigDecimal(priceObj.toString()));
            }
        }
        if (updates.containsKey("stock")) {
            Object qtyObj = updates.get("stock");
            if (qtyObj != null) {
                product.setStock(Integer.parseInt(qtyObj.toString()));
            }
        }
        if (updates.containsKey("isActive")) {
            product.setIsActive((Boolean) updates.get("isActive"));
        }

        return productRepository.save(product);
    }

    @Override
    public Map<String, Object> cutQuantity(Long id, int qty) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (qty <= 0) {
            throw new IllegalArgumentException("qty must be > 0");
        }
        if (p.getStock() < qty) {
            throw new IllegalArgumentException("insufficient stock");
        }

        p.setStock(p.getStock() - qty);
        productRepository.save(p);

        return Map.of(
                "id", p.getId(),
                "deducted", qty,
                "remainingQty", p.getStock()
        );
    }

    @Override
    public void softDeleteProduct(Long id) {
        productRepository.softDeleteById(id);
    }
}
