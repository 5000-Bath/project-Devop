package com.ecommerce.backend.services;

import com.ecommerce.backend.models.Product;
import com.ecommerce.backend.repositories.CategoryRepository;
import com.ecommerce.backend.repositories.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceImplTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    // ตั้งค่า Path รูปภาพหลอกๆ เพื่อไม่ให้ Error ตอนเทส
    @BeforeEach
    void setUp() {
        String tempDir = System.getProperty("java.io.tmpdir"); // ใช้ folder temp ของเครื่อง
        productService.setUploadPath(tempDir);
    }

    // --- 1. Test: Get Products ---
    @Test
    void getAllProducts_Success() {
        when(productRepository.findByIsActiveTrue()).thenReturn(List.of(new Product(), new Product()));
        List<Product> result = productService.getAllProducts();
        assertEquals(2, result.size());
    }

    @Test
    void getProductById_Success() {
        Product product = new Product();
        product.setId(1L);
        product.setIsActive(true); // ต้อง active
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        Product result = productService.getProductById(1L);
        assertEquals(1L, result.getId());
    }

    @Test
    void getProductById_NotFound() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> productService.getProductById(99L));
    }

    @Test
    void getProductById_FoundButInactive() {
        Product product = new Product();
        product.setId(1L);
        product.setIsActive(false); // ไม่ active
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        // ต้อง throw Error ว่าหาไม่เจอ (เพราะเราซ่อนสินค้าไว้)
        assertThrows(RuntimeException.class, () -> productService.getProductById(1L));
    }

    // --- 2. Test: Create Product ---
    @Test
    void createProduct_Success_NoImage() {
        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArguments()[0]);

        Product result = productService.createProduct("Test Product", "Desc", BigDecimal.TEN, 100, true, null, "Electronics");

        assertNotNull(result);
        assertEquals("Test Product", result.getName());
        assertEquals("Electronics", result.getCategory());
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    void createProduct_Success_WithImage() throws IOException {
        // Mock ไฟล์รูปภาพ
        MultipartFile mockImage = mock(MultipartFile.class);
        when(mockImage.isEmpty()).thenReturn(false);
        when(mockImage.getOriginalFilename()).thenReturn("test.jpg");

        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArguments()[0]);

        Product result = productService.createProduct("With Image", "Desc", BigDecimal.TEN, 10, true, mockImage, "General");

        assertNotNull(result);
        assertNotNull(result.getImageUrl()); // ต้องมี URL รูป
        assertTrue(result.getImageUrl().contains("test.jpg"));

        // เช็คว่ามีการสั่ง save file จริง (แต่เราใช้ temp folder เลยไม่พัง)
        verify(mockImage, times(1)).transferTo(any(File.class));
    }

    // --- 3. Test: Update Product ---
    @Test
    void updateProduct_Success_AllFields() {
        Product existing = new Product();
        existing.setId(1L);
        existing.setName("Old Name");

        when(productRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArguments()[0]);

        // Map ข้อมูลใหม่
        Map<String, Object> updates = Map.of(
                "name", "New Name",
                "description", "New Desc",
                "price", 999.00,
                "stock", 50,
                "isActive", false,
                "category", "New Cat"
        );

        Product updated = productService.updateProduct(1L, updates);

        assertEquals("New Name", updated.getName());
        assertEquals(new BigDecimal("999.0"), updated.getPrice());
        assertEquals(50, updated.getStock());
        assertEquals("New Cat", updated.getCategory());
        assertFalse(updated.getIsActive());
    }

    @Test
    void updateProduct_WithImage() throws IOException {
        Product existing = new Product();
        existing.setId(1L);

        when(productRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArguments()[0]);

        MultipartFile mockImage = mock(MultipartFile.class);
        when(mockImage.isEmpty()).thenReturn(false);
        when(mockImage.getOriginalFilename()).thenReturn("update.png");

        // ส่ง Map ที่มี Image
        Map<String, Object> updates = Map.of("image", mockImage);

        Product updated = productService.updateProduct(1L, updates);

        assertNotNull(updated.getImageUrl());
        assertTrue(updated.getImageUrl().contains("update.png"));
    }

    @Test
    void updateProduct_EmptyCategory() {
        Product existing = new Product();
        existing.setCategory("Old");
        when(productRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(productRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        // ส่ง category เป็นว่าง -> ต้องกลายเป็น null
        Map<String, Object> updates = Map.of("category", "");

        Product updated = productService.updateProduct(1L, updates);
        assertNull(updated.getCategory());
    }

    // --- 4. Test: Cut Quantity ---
    @Test
    void cutQuantity_Success() {
        Product p = new Product();
        p.setId(1L);
        p.setStock(10);
        when(productRepository.findById(1L)).thenReturn(Optional.of(p));

        Map<String, Object> result = productService.cutQuantity(1L, 2);

        assertEquals(8, p.getStock()); // เหลือ 8
        assertEquals(8, result.get("remainingQty"));
    }

    @Test
    void cutQuantity_InvalidQty() {
        Product p = new Product();
        when(productRepository.findById(1L)).thenReturn(Optional.of(p));

        // ตัด 0 หรือ ติดลบ ไม่ได้
        assertThrows(IllegalArgumentException.class, () -> productService.cutQuantity(1L, 0));
    }

    @Test
    void cutQuantity_InsufficientStock() {
        Product p = new Product();
        p.setStock(5);
        when(productRepository.findById(1L)).thenReturn(Optional.of(p));

        // มี 5 จะตัด 10 ต้อง Error
        assertThrows(IllegalArgumentException.class, () -> productService.cutQuantity(1L, 10));
    }

    // --- 5. Test: Soft Delete ---
    @Test
    void softDeleteProduct_Success() {
        // 1. เตรียมข้อมูล Product ที่จะใช้ทดสอบ
        Product product = new Product();
        product.setId(1L);
        product.setIsActive(true);

        // 2. Mock repository: เมื่อ findById(1L) ถูกเรียก ให้คืน product ที่เราเตรียมไว้
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        // 3. เรียกใช้เมธอดที่ต้องการทดสอบ
        productService.softDeleteProduct(1L);

        // 4. ตรวจสอบว่า productRepository.save() ถูกเรียก 1 ครั้ง และ product ที่ส่งไป save มีสถานะเป็น false
        verify(productRepository, times(1)).save(product);
        assertFalse(product.getIsActive()); // ตรวจสอบว่าสถานะเปลี่ยนเป็น false
        assertNotNull(product.getDeletedAt()); // ตรวจสอบว่ามีการตั้งเวลาที่ลบ
    }
}