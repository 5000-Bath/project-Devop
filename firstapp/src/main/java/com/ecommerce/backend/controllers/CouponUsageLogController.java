package com.ecommerce.backend.controllers;

import com.ecommerce.backend.models.CouponUsageLog;
import com.ecommerce.backend.repositories.CouponUsageLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coupon-usage-logs")
public class CouponUsageLogController {

    @Autowired
    private CouponUsageLogRepository couponUsageLogRepository;

    @GetMapping
    public List<CouponUsageLog> getAllCouponUsageLogs() {
        return couponUsageLogRepository.findAll();
    }

    @GetMapping("/{id}")
    public CouponUsageLog getCouponUsageLogById(@PathVariable Long id) {
        return couponUsageLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CouponUsageLog not found"));
    }

    @PostMapping
    public CouponUsageLog createCouponUsageLog(@RequestBody CouponUsageLog couponUsageLog) {
        return couponUsageLogRepository.save(couponUsageLog);
    }

    @PutMapping("/{id}")
    public CouponUsageLog updateCouponUsageLog(@PathVariable Long id, @RequestBody CouponUsageLog couponUsageLogDetails) {
        CouponUsageLog couponUsageLog = couponUsageLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CouponUsageLog not found"));

        couponUsageLog.setCoupon(couponUsageLogDetails.getCoupon());
        couponUsageLog.setUsedAt(couponUsageLogDetails.getUsedAt());
        couponUsageLog.setOriginalAmount(couponUsageLogDetails.getOriginalAmount());
        couponUsageLog.setDiscountApplied(couponUsageLogDetails.getDiscountApplied());
        couponUsageLog.setFinalAmount(couponUsageLogDetails.getFinalAmount());
        couponUsageLog.setRemainingAfterUse(couponUsageLogDetails.getRemainingAfterUse());

        return couponUsageLogRepository.save(couponUsageLog);
    }

    @DeleteMapping("/{id}")
    public void deleteCouponUsageLog(@PathVariable Long id) {
        couponUsageLogRepository.deleteById(id);
    }
}
