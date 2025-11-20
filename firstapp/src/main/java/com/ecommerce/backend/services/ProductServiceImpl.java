package com.ecommerce.backend.services;

import com.ecommerce.backend.models.Category;
import com.ecommerce.backend.models.Product;
import com.ecommerce.backend.repositories.CategoryRepository;
import com.ecommerce.backend.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
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

    @Autowired
    private CategoryRepository categoryRepository;

    @Value("${upload.path.images}")
    private String uploadPath;

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
    public Product createProduct(String name, String description, BigDecimal price, int stock, boolean isActive, MultipartFile image, String category) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setStock(stock);
        product.setIsActive(isActive);
        product.setCreatedAt(LocalDateTime.now()); // Set creation timestamp

        product.setCategory(category);

        if (image != null && !image.isEmpty()) {
            try {
                File uploadDir = new File(uploadPath);
                if (!uploadDir.exists()) {
                    uploadDir.mkdirs();
                }

                String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                Path filePath = Paths.get(uploadPath, fileName);
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
            Object nameObj = updates.get("name");
            if (nameObj != null) {
                product.setName(nameObj.toString());
            }
        }
        if (updates.containsKey("description")) {
            Object descObj = updates.get("description");
            product.setDescription(descObj != null ? descObj.toString() : null);
        }
        if (updates.containsKey("price")) {
            Object priceObj = updates.get("price");
            if (priceObj != null) {
                product.setPrice(new BigDecimal(priceObj.toString()));
            }
        }
        if (updates.containsKey("stock")) {
            Object stockObj = updates.get("stock");
            if (stockObj != null) {
                product.setStock(Integer.parseInt(stockObj.toString()));
            }
        }
        if (updates.containsKey("isActive")) {
            Object isActiveObj = updates.get("isActive");
            if (isActiveObj != null) {
                product.setIsActive((Boolean) isActiveObj);
            }
        }
        if (updates.containsKey("category")) {
            // Handle empty string for category to set it to null or keep as is
            Object categoryObj = updates.get("category");
            if (categoryObj == null || categoryObj.toString().isEmpty()) {
                product.setCategory(null);
            } else {
                product.setCategory(categoryObj.toString());
            }
        }
        if (updates.containsKey("image")) {
            MultipartFile image = (MultipartFile) updates.get("image");
            if (image != null && !image.isEmpty()) {
                try {
                    File uploadDir = new File(uploadPath);
                    if (!uploadDir.exists()) {
                        uploadDir.mkdirs();
                    }
                    String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                    Path filePath = Paths.get(uploadPath, fileName);
                    image.transferTo(filePath.toFile());
                    product.setImageUrl("/uploads/images/" + fileName);
                } catch (Exception e) {
                    e.printStackTrace(); // Consider a better error handling
                }
            }
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