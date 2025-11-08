package com.ecommerce.backend.controllers;

import com.ecommerce.backend.models.CouponUsageLog;
import com.ecommerce.backend.services.CouponUsageLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coupon-usage-logs")
public class CouponUsageLogController {

    @Autowired
    private CouponUsageLogService couponUsageLogService;

    @GetMapping
    public List<CouponUsageLog> getAllCouponUsageLogs() {
        return couponUsageLogService.getAllCouponUsageLogs();
    }

    @GetMapping("/{id}")
    public CouponUsageLog getCouponUsageLogById(@PathVariable Long id) {
        return couponUsageLogService.getCouponUsageLogById(id);
    }

    @PostMapping
    public CouponUsageLog createCouponUsageLog(@RequestBody CouponUsageLog couponUsageLog) {
        return couponUsageLogService.createCouponUsageLog(couponUsageLog);
    }

    @PutMapping("/{id}")
    public CouponUsageLog updateCouponUsageLog(@PathVariable Long id, @RequestBody CouponUsageLog couponUsageLogDetails) {
        return couponUsageLogService.updateCouponUsageLog(id, couponUsageLogDetails);
    }

    @DeleteMapping("/{id}")
    public void deleteCouponUsageLog(@PathVariable Long id) {
        couponUsageLogService.deleteCouponUsageLog(id);
    }
}
