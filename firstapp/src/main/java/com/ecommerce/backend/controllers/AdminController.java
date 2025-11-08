package com.ecommerce.backend.controllers;

import com.ecommerce.backend.dtos.ProductSaleDto;
import com.ecommerce.backend.dtos.StockReportDto;
import com.ecommerce.backend.models.Admin;
import com.ecommerce.backend.models.Product;
import com.ecommerce.backend.repositories.OrderItemRepository;
import com.ecommerce.backend.repositories.ProductRepository;
import com.ecommerce.backend.services.AdminService;
import com.ecommerce.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admins")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/reports/stock/weekly")
    public List<StockReportDto> getWeeklyStockReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        LocalDateTime end = (endDate == null) ? LocalDateTime.now() : endDate.atTime(LocalTime.MAX);
        LocalDateTime start = (startDate == null) ? end.minusDays(7) : startDate.atStartOfDay();

        List<ProductSaleDto> sales = orderItemRepository.findSalesByProductBetweenDates(start, end);
        Map<Long, Long> salesMap = sales.stream()
                .collect(Collectors.toMap(ProductSaleDto::getProductId, ProductSaleDto::getUnitsSold));

        List<Product> products = productRepository.findAll();

        return products.stream().map(product -> {
            int unitsSold = salesMap.getOrDefault(product.getId(), 0L).intValue();
            int endingStock = product.getStock();
            int startingStock = endingStock + unitsSold;
            return new StockReportDto(product.getId(), product.getName(), startingStock, endingStock, unitsSold);
        }).collect(Collectors.toList());
    }

    // ดึงข้อมูล Admin ทั้งหมด
    @GetMapping
    public List<Admin> getAllAdmins() {
        return adminService.getAllAdmins();
    }

    // ดึง Admin ตาม ID
    @GetMapping("/{id}")
    public Admin getAdminById(@PathVariable Long id) {
        return adminService.getAdminById(id);
    }

    // ดึงข้อมูลตัวเองจาก token
    @GetMapping("/me")
    public ResponseEntity<?> getMe(@CookieValue(name = "token", required = false) String token) {
        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token missing");
        }
        try {
            String username = jwtUtil.getUsernameFromToken(token);
            // Admin admin = adminRepository.findByUsername(username) // This line needs to be updated to use AdminService
            //         .orElseThrow(() -> new RuntimeException("Admin not found"));
            // return ResponseEntity.ok(admin);
            // For now, I'll keep the direct repository call for getMe as it's not a standard CRUD operation
            // and requires a specific findByUsername method which might not be in the generic AdminService interface.
            // If findByUsername is needed in AdminService, it should be added there.
            return ResponseEntity.ok(adminService.getAdminByUsername(username));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token invalid or expired");
        }
    }

    // สร้าง Admin ใหม่
    @PostMapping
    public Admin createAdmin(@RequestBody Admin admin) {
        return adminService.createAdmin(admin);
    }

    // แก้ไข Admin
    @PutMapping("/{id}")
    public Admin updateAdmin(@PathVariable Long id, @RequestBody Map<String, Object> adminDetails) {
        return adminService.updateAdmin(id, adminDetails);
    }

    // ลบ Admin
    @DeleteMapping("/{id}")
    public void deleteAdmin(@PathVariable Long id) {
        adminService.deleteAdmin(id);
    }
}
