package com.ecommerce.backend.services;

import com.ecommerce.backend.models.CouponUsageLog;
import com.ecommerce.backend.repositories.CouponUsageLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CouponUsageLogServiceImpl implements CouponUsageLogService {

    @Autowired
    private CouponUsageLogRepository couponUsageLogRepository;

    @Override
    public List<CouponUsageLog> getAllCouponUsageLogs() {
        return couponUsageLogRepository.findAll();
    }

    @Override
    public CouponUsageLog getCouponUsageLogById(Long id) {
        return couponUsageLogRepository.findById(id).orElseThrow(() -> new RuntimeException("CouponUsageLog not found"));
    }

    @Override
    public CouponUsageLog createCouponUsageLog(CouponUsageLog couponUsageLog) {
        return couponUsageLogRepository.save(couponUsageLog);
    }

    @Override
    public CouponUsageLog updateCouponUsageLog(Long id, CouponUsageLog couponUsageLogDetails) {
        CouponUsageLog couponUsageLog = couponUsageLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CouponUsageLog not found"));

        couponUsageLog.setCoupon(couponUsageLogDetails.getCoupon());
        couponUsageLog.setOrder(couponUsageLogDetails.getOrder());
        couponUsageLog.setUsedAt(couponUsageLogDetails.getUsedAt());
        couponUsageLog.setOriginalAmount(couponUsageLogDetails.getOriginalAmount());
        couponUsageLog.setDiscountApplied(couponUsageLogDetails.getDiscountApplied());
        couponUsageLog.setFinalAmount(couponUsageLogDetails.getFinalAmount());
        couponUsageLog.setRemainingAfterUse(couponUsageLogDetails.getRemainingAfterUse());

        return couponUsageLogRepository.save(couponUsageLog);
    }

    @Override
    public void deleteCouponUsageLog(Long id) {
        couponUsageLogRepository.deleteById(id);
    }
}
