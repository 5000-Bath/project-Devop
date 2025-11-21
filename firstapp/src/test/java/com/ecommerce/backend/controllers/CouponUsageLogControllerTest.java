package com.ecommerce.backend.controllers;

import com.ecommerce.backend.models.CouponUsageLog;
import com.ecommerce.backend.services.CouponUsageLogService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CouponUsageLogController.class)
@AutoConfigureMockMvc(addFilters = false) // ปิด Security
class CouponUsageLogControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CouponUsageLogService couponUsageLogService;

    @Test
    void getAllLogs_Success() throws Exception {
        when(couponUsageLogService.getAllCouponUsageLogs()).thenReturn(List.of(new CouponUsageLog()));

        // เดาว่า Endpoint คือ /api/coupon-usage-logs (ถ้าไม่ใช่ ให้แก้ตาม Controller จริงนะครับ)
        mockMvc.perform(get("/api/coupon-usage-logs"))
                .andExpect(status().isOk());
    }

    @Test
    void getLogById_Success() throws Exception {
        CouponUsageLog log = new CouponUsageLog();
        log.setId(1L);
        when(couponUsageLogService.getCouponUsageLogById(1L)).thenReturn(log);

        mockMvc.perform(get("/api/coupon-usage-logs/1"))
                .andExpect(status().isOk());
    }
}