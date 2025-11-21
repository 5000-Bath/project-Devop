package com.ecommerce.backend.services;

import com.ecommerce.backend.models.Coupon;
import com.ecommerce.backend.models.CouponUsageLog;
import com.ecommerce.backend.models.Order;
import com.ecommerce.backend.repositories.CouponUsageLogRepository;
import com.ecommerce.backend.repositories.CouponRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CouponServiceImplTest {

    @Mock
    private CouponRepository couponRepository;

    @Mock
    private CouponUsageLogRepository couponUsageLogRepository;

    @InjectMocks
    private CouponServiceImpl couponService;

    // --- 1. Test: Create ---
    @Test
    void createCoupon_Success() {
        Coupon request = new Coupon();
        request.setCode("NEW999");

        when(couponRepository.save(any(Coupon.class))).thenReturn(request);

        Coupon result = couponService.createCoupon(request);
        assertNotNull(result);
        assertEquals("NEW999", result.getCode());
    }

    // --- 2. Test: Read (Get All / Get By ID / Get By Code) ---
    @Test
    void getAllCoupons_Success() {
        when(couponRepository.findAll()).thenReturn(List.of(new Coupon(), new Coupon()));
        List<Coupon> result = couponService.getAllCoupons();
        assertEquals(2, result.size());
    }

    @Test
    void getCouponById_Success() {
        Coupon mockCoupon = new Coupon();
        mockCoupon.setId(1L);
        when(couponRepository.findById(1L)).thenReturn(Optional.of(mockCoupon));

        Coupon result = couponService.getCouponById(1L);
        assertEquals(1L, result.getId());
    }

    @Test
    void getCouponById_NotFound() {
        when(couponRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> couponService.getCouponById(99L));
    }

    @Test
    void getCouponByCode_Success() {
        Coupon mockCoupon = new Coupon();
        mockCoupon.setCode("TEST");
        when(couponRepository.findByCode("TEST")).thenReturn(Optional.of(mockCoupon));

        Coupon result = couponService.getCouponByCode("TEST");
        assertEquals("TEST", result.getCode());
    }

    @Test
    void getCouponByCode_NotFound() {
        when(couponRepository.findByCode("UNKNOWN")).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> couponService.getCouponByCode("UNKNOWN"));
    }

    // --- 3. Test: Update ---
    @Test
    void updateCoupon_Success() {
        // จำลองข้อมูลเดิมใน DB
        Coupon existing = new Coupon();
        existing.setId(1L);
        existing.setCode("OLD");
        existing.setRemainingCount(5);

        when(couponRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(couponRepository.save(any(Coupon.class))).thenAnswer(i -> i.getArguments()[0]); // return ตัวที่ส่งไป save

        // ข้อมูลที่จะแก้ (ส่งเป็น Map ตาม Service จริง)
        Map<String, Object> updates = Map.of(
                "code", "NEW_CODE",
                "discountAmount", 100.00,
                "remainingCount", 50,
                "expirationDate", LocalDateTime.now().plusDays(10).toString() // ต้องส่งเป็น String เพราะ Service ใช้ parse
        );

        Coupon updated = couponService.updateCoupon(1L, updates);

        assertEquals("NEW_CODE", updated.getCode());
        assertEquals(new BigDecimal("100.0"), updated.getDiscountAmount()); // ระวังเรื่องทศนิยม
        assertEquals(50, updated.getRemainingCount());
    }

    @Test
    void updateCoupon_NotFound() {
        when(couponRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> couponService.updateCoupon(99L, Map.of()));
    }

    // --- 4. Test: Delete ---
    @Test
    void deleteCoupon_Success() {
        doNothing().when(couponRepository).deleteById(1L);
        couponService.deleteCoupon(1L);
        verify(couponRepository, times(1)).deleteById(1L);
    }

    // --- 5. Test: Validate Logic (จุดสำคัญ!) ---
    @Test
    void validateCoupon_Success() {
        Coupon coupon = new Coupon();
        coupon.setCode("VALID");
        coupon.setExpirationDate(LocalDateTime.now().plusDays(1)); // ยังไม่หมดอายุ
        coupon.setRemainingCount(10); // ยังมีของ
        coupon.setDiscountAmount(new BigDecimal("20.00"));

        when(couponRepository.findByCode("VALID")).thenReturn(Optional.of(coupon));

        Map<String, Object> result = couponService.validateCoupon("VALID", new BigDecimal("100.00"));

        assertEquals(new BigDecimal("20.00"), result.get("discountApplied"));
        assertEquals(new BigDecimal("80.00"), result.get("finalAmount")); // 100 - 20 = 80
    }

    @Test
    void validateCoupon_Expired() {
        Coupon coupon = new Coupon();
        coupon.setExpirationDate(LocalDateTime.now().minusDays(1)); // หมดอายุเมื่อวาน

        when(couponRepository.findByCode("EXPIRED")).thenReturn(Optional.of(coupon));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> couponService.validateCoupon("EXPIRED", BigDecimal.TEN));
        assertTrue(ex.getMessage().contains("หมดอายุ"));
    }

    @Test
    void validateCoupon_NoStock() {
        Coupon coupon = new Coupon();
        coupon.setExpirationDate(LocalDateTime.now().plusDays(1));
        coupon.setRemainingCount(0); // ของหมด

        when(couponRepository.findByCode("EMPTY")).thenReturn(Optional.of(coupon));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> couponService.validateCoupon("EMPTY", BigDecimal.TEN));
        assertTrue(ex.getMessage().contains("ใช้ครบจำนวนแล้ว"));
    }

    // --- 6. Test: Apply Coupon & Log (จุดที่เชื่อมกับ Order) ---
    @Test
    void applyCouponToOrder_Success() {
        // เตรียม Order
        Order order = new Order();
        order.setUserId(1L);
        order.setCouponCode("SAVE10");
        order.setDiscountAmount(new BigDecimal("10.00"));
        order.setFinalAmount(new BigDecimal("90.00"));

        // เตรียม Coupon
        Coupon coupon = new Coupon();
        coupon.setCode("SAVE10");
        coupon.setRemainingCount(5);

        when(couponRepository.findByCode("SAVE10")).thenReturn(Optional.of(coupon));

        // เรียกใช้งาน
        couponService.applyCouponToOrder(order);

        // ตรวจสอบว่ามีการลดจำนวนคูปองลง 1
        assertEquals(4, coupon.getRemainingCount());
        verify(couponRepository, times(1)).save(coupon);

        // ตรวจสอบว่ามีการบันทึก Log
        verify(couponUsageLogRepository, times(1)).save(any(CouponUsageLog.class));
    }

    @Test
    void applyCouponToOrder_NoCouponCode() {
        Order order = new Order();
        order.setCouponCode(null); // ไม่มีคูปอง

        couponService.applyCouponToOrder(order);

        // ต้องไม่มีการเรียก Repository ใดๆ
        verify(couponRepository, never()).findByCode(any());
    }
}