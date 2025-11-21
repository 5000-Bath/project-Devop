package com.ecommerce.backend.services;

import com.ecommerce.backend.models.CouponUsageLog;
import com.ecommerce.backend.repositories.CouponUsageLogRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CouponUsageLogServiceImplTest {

    @Mock
    private CouponUsageLogRepository couponUsageLogRepository;

    @InjectMocks
    private CouponUsageLogServiceImpl couponUsageLogService;

    @Test
    void getAllCouponUsageLogs_Success() {
        when(couponUsageLogRepository.findAll()).thenReturn(List.of(new CouponUsageLog(), new CouponUsageLog()));
        assertEquals(2, couponUsageLogService.getAllCouponUsageLogs().size());
    }

    @Test
    void getCouponUsageLogById_Success() {
        CouponUsageLog log = new CouponUsageLog();
        log.setId(1L);
        when(couponUsageLogRepository.findById(1L)).thenReturn(Optional.of(log));

        CouponUsageLog result = couponUsageLogService.getCouponUsageLogById(1L);
        assertEquals(1L, result.getId());
    }

    @Test
    void getCouponUsageLogById_NotFound() {
        when(couponUsageLogRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> couponUsageLogService.getCouponUsageLogById(99L));
    }

    @Test
    void createCouponUsageLog_Success() {
        CouponUsageLog log = new CouponUsageLog();
        when(couponUsageLogRepository.save(any(CouponUsageLog.class))).thenReturn(log);

        assertNotNull(couponUsageLogService.createCouponUsageLog(log));
    }

    @Test
    void updateCouponUsageLog_Success() {
        // ของเดิมใน DB
        CouponUsageLog existing = new CouponUsageLog();
        existing.setId(1L);

        when(couponUsageLogRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(couponUsageLogRepository.save(any(CouponUsageLog.class))).thenAnswer(i -> i.getArguments()[0]);

        // ของใหม่ที่จะเอาไปทับ (ส่งเป็น Object ตามโค้ดจริง)
        CouponUsageLog details = new CouponUsageLog();
        // สมมติว่ามีการ set ค่าต่างๆ (ใน Test จริงอาจไม่ต้อง set ครบก็ได้เพราะ Logic คือการ get/set ธรรมดา)

        CouponUsageLog result = couponUsageLogService.updateCouponUsageLog(1L, details);
        assertNotNull(result);
    }

    @Test
    void deleteCouponUsageLog_Success() {
        doNothing().when(couponUsageLogRepository).deleteById(1L);
        couponUsageLogService.deleteCouponUsageLog(1L);
        verify(couponUsageLogRepository, times(1)).deleteById(1L);
    }
}