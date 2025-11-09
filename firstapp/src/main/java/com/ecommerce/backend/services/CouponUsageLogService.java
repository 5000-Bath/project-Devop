package com.ecommerce.backend.services;

import com.ecommerce.backend.models.CouponUsageLog;

import java.util.List;

public interface CouponUsageLogService {
    List<CouponUsageLog> getAllCouponUsageLogs();
    CouponUsageLog getCouponUsageLogById(Long id);
    CouponUsageLog createCouponUsageLog(CouponUsageLog couponUsageLog);
    CouponUsageLog updateCouponUsageLog(Long id, CouponUsageLog couponUsageLogDetails);
    void deleteCouponUsageLog(Long id);
}
