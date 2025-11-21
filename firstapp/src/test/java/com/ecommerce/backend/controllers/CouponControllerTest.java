package com.ecommerce.backend.controllers;

import com.ecommerce.backend.models.Coupon;
import com.ecommerce.backend.services.CouponService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc; // Import เพิ่ม
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CouponController.class)
// --- เพิ่มบรรทัดนี้ครับ: บอกให้ปิด Security Filter (ยาม) ไปก่อน ---
@AutoConfigureMockMvc(addFilters = false)
class CouponControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CouponService couponService;

    @Autowired
    private ObjectMapper objectMapper;

    // --- 1. Test GET (Read) ---
    @Test
    void getAllCoupons_Success() throws Exception {
        when(couponService.getAllCoupons()).thenReturn(List.of(new Coupon(), new Coupon()));

        mockMvc.perform(get("/api/coupons"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void getCouponById_Success() throws Exception {
        Coupon c = new Coupon();
        c.setId(1L);
        c.setCode("TEST1");
        when(couponService.getCouponById(1L)).thenReturn(c);

        mockMvc.perform(get("/api/coupons/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("TEST1"));
    }

    @Test
    void getCouponByCode_Success() throws Exception {
        Coupon c = new Coupon();
        c.setCode("CODE99");
        when(couponService.getCouponByCode("CODE99")).thenReturn(c);

        mockMvc.perform(get("/api/coupons/code/CODE99"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("CODE99"));
    }

    // --- 2. Test POST (Create) ---
    @Test
    void createCoupon_Success() throws Exception {
        Map<String, Object> frontendData = new HashMap<>();
        frontendData.put("code", "NEW2025");
        frontendData.put("discountValue", 100);
        frontendData.put("maxUses", 50);
        frontendData.put("expiryDate", "2025-12-31T23:59:59");

        Coupon savedCoupon = new Coupon();
        savedCoupon.setId(1L);
        savedCoupon.setCode("NEW2025");

        when(couponService.createCoupon(any(Coupon.class))).thenReturn(savedCoupon);

        mockMvc.perform(post("/api/coupons")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(frontendData)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("NEW2025"));
    }

    // --- 3. Test PUT (Update) ---
    @Test
    void updateCoupon_Success() throws Exception {
        Map<String, Object> updateData = new HashMap<>();
        updateData.put("discountValue", 500);

        Coupon updatedCoupon = new Coupon();
        updatedCoupon.setId(1L);
        updatedCoupon.setDiscountAmount(new BigDecimal("500"));

        when(couponService.updateCoupon(eq(1L), any(Map.class))).thenReturn(updatedCoupon);

        mockMvc.perform(put("/api/coupons/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateData)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.discountAmount").value(500));
    }

    // --- 4. Test DELETE ---
    @Test
    void deleteCoupon_Success() throws Exception {
        doNothing().when(couponService).deleteCoupon(1L);

        mockMvc.perform(delete("/api/coupons/1"))
                .andExpect(status().isOk());

        verify(couponService, times(1)).deleteCoupon(1L);
    }

    // --- 5. Test Validate ---
    @Test
    void validateCoupon_Success() throws Exception {
        Map<String, Object> req = Map.of("code", "SAVE10", "originalAmount", 100);
        Map<String, Object> serviceResult = Map.of("discountApplied", new BigDecimal("10"), "finalAmount", new BigDecimal("90"));

        when(couponService.validateCoupon(eq("SAVE10"), any(BigDecimal.class))).thenReturn(serviceResult);

        mockMvc.perform(post("/api/coupons/validate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.newAmount").value(90));
    }

    @Test
    void validateCoupon_Failed() throws Exception {
        Map<String, Object> req = Map.of("code", "EXPIRED", "originalAmount", 100);

        when(couponService.validateCoupon(anyString(), any())).thenThrow(new RuntimeException("คูปองหมดอายุ"));

        mockMvc.perform(post("/api/coupons/validate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest()) // 400 Bad Request
                .andExpect(content().string("คูปองหมดอายุ"));
    }
}