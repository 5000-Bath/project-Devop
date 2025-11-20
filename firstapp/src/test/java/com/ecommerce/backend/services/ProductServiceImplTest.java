package com.ecommerce.backend.services;

import com.ecommerce.backend.models.Product;
import com.ecommerce.backend.repositories.CategoryRepository;
import com.ecommerce.backend.repositories.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
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

    private Product product;

    @BeforeEach
    void setUp() {
        product = new Product();
        product.setId(1L);
        product.setName("Test Product");
        product.setPrice(new BigDecimal("100.00"));
        product.setStock(10);
        product.setIsActive(true);
    }

    @Test
    void createProduct_Success() throws IOException {
        // Mock MultipartFile
        MultipartFile image = mock(MultipartFile.class);
        when(image.isEmpty()).thenReturn(false);
        when(image.getOriginalFilename()).thenReturn("test.jpg");

        // Mock ProductRepository
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> {
            Product p = invocation.getArgument(0);
            p.setId(2L); // Simulate saving and getting an ID
            return p;
        });

        // Mock static methods for Path and Files
        try (MockedStatic<Paths> paths = mockStatic(Paths.class);
             MockedStatic<Files> files = mockStatic(Files.class)) {

            Path path = mock(Path.class);
            paths.when(() -> Paths.get(anyString())).thenReturn(path);
            files.when(() -> Files.exists(path)).thenReturn(true);
            doNothing().when(image).transferTo(any(Path.class));

            Product newProduct = productService.createProduct(
                    "New Product",
                    "Description",
                    new BigDecimal("200.00"),
                    50,
                    true,
                    image,
                    "Category"
            );

            assertNotNull(newProduct);
            assertEquals("New Product", newProduct.getName());
            assertNotNull(newProduct.getImageUrl());
            assertTrue(newProduct.getImageUrl().contains("test.jpg"));
            verify(productRepository, times(1)).save(any(Product.class));
        }
    }
    
    @Test
    void getAllProducts_Success() {
        when(productRepository.findByIsActiveTrue()).thenReturn(List.of(product));

        List<Product> products = productService.getAllProducts();

        assertNotNull(products);
        assertEquals(1, products.size());
        verify(productRepository, times(1)).findByIsActiveTrue();
    }

    @Test
    void getProductById_Success() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        Product foundProduct = productService.getProductById(1L);

        assertNotNull(foundProduct);
        assertEquals(product.getId(), foundProduct.getId());
        verify(productRepository, times(1)).findById(1L);
    }

    @Test
    void getProductById_NotFound() {
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            productService.getProductById(1L);
        });

        assertEquals("Product not found", exception.getMessage());
        verify(productRepository, times(1)).findById(1L);
    }

    @Test
    void getProductById_InactiveProduct() {
        product.setIsActive(false);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            productService.getProductById(1L);
        });

        assertEquals("Product not found", exception.getMessage());
        verify(productRepository, times(1)).findById(1L);
    }

    @Test
    void cutQuantity_Success() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenReturn(product);

        int quantityToCut = 3;
        int expectedRemainingStock = product.getStock() - quantityToCut;

        var result = productService.cutQuantity(1L, quantityToCut);

        assertEquals(expectedRemainingStock, product.getStock());
        assertEquals(expectedRemainingStock, result.get("remainingQty"));
        verify(productRepository, times(1)).findById(1L);
        verify(productRepository, times(1)).save(product);
    }

    @Test
    void cutQuantity_ProductNotFound() {
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            productService.cutQuantity(1L, 5);
        });

        assertEquals("Product not found", exception.getMessage());
        verify(productRepository, times(1)).findById(1L);
        verify(productRepository, never()).save(any());
    }

    @Test
    void cutQuantity_InvalidQuantity() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            productService.cutQuantity(1L, 0);
        });

        assertEquals("qty must be > 0", exception.getMessage());
        verify(productRepository, times(1)).findById(1L);
        verify(productRepository, never()).save(any());
    }

    @Test
    void cutQuantity_InsufficientStock() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            productService.cutQuantity(1L, 20); // Stock is 10
        });

        assertEquals("insufficient stock", exception.getMessage());
        verify(productRepository, times(1)).findById(1L);
        verify(productRepository, never()).save(any());
    }

    @Test
    void softDeleteProduct_Success() {
        Long productId = 1L;
        doNothing().when(productRepository).softDeleteById(productId);

        productService.softDeleteProduct(productId);

        verify(productRepository, times(1)).softDeleteById(productId);
    }

    @Test
    void updateProduct_Success() {
        Map<String, Object> updates = new HashMap<>();
        updates.put("name", "New Name");
        updates.put("price", new BigDecimal("150.00"));

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Product updatedProduct = productService.updateProduct(1L, updates);

        assertNotNull(updatedProduct);
        assertEquals("New Name", updatedProduct.getName());
        assertEquals(new BigDecimal("150.00"), updatedProduct.getPrice());
        verify(productRepository, times(1)).findById(1L);
        verify(productRepository, times(1)).save(product);
    }

    @Test
    void updateProduct_NotFound() {
        Map<String, Object> updates = new HashMap<>();
        updates.put("name", "New Name");

        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            productService.updateProduct(1L, updates);
        });

        assertEquals("Product not found", exception.getMessage());
        verify(productRepository, times(1)).findById(1L);
        verify(productRepository, never()).save(any());
    }
}
