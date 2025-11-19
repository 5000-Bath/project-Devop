package com.ecommerce.backend.services;

import com.ecommerce.backend.models.Coupon;
import com.ecommerce.backend.models.CouponUsageLog;
import com.ecommerce.backend.repositories.CouponRepository;
import com.ecommerce.backend.repositories.CouponUsageLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class CouponServiceImpl implements CouponService {

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private CouponUsageLogRepository couponUsageLogRepository;

    @Override
    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    @Override
    public Coupon getCouponById(Long id) {
        return couponRepository.findById(id).orElseThrow(() -> new RuntimeException("Coupon not found"));
    }

    @Override
    public Coupon getCouponByCode(String code) {
        return couponRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));
    }

    @Override
    public Coupon createCoupon(Coupon coupon) {
        return couponRepository.save(coupon);
    }

    @Override
    public Coupon updateCoupon(Long id, Map<String, Object> updates) {
        Coupon coupon = couponRepository.findById(id).orElseThrow(() -> new RuntimeException("Coupon not found"));

        if (updates.containsKey("code")) {
            coupon.setCode((String) updates.get("code"));
        }
        if (updates.containsKey("discountAmount")) {
            coupon.setDiscountAmount(new BigDecimal(updates.get("discountAmount").toString()));
        }
        if (updates.containsKey("remainingCount")) {
            coupon.setRemainingCount((Integer) updates.get("remainingCount"));
        }
        if (updates.containsKey("expirationDate")) {
            coupon.setExpirationDate(LocalDateTime.parse(updates.get("expirationDate").toString()));
        }

        return couponRepository.save(coupon);
    }

    @Override
    public void deleteCoupon(Long id) {
        couponRepository.deleteById(id);
    }

    @Override
    public Map<String, Object> useCoupon(String code, BigDecimal originalAmount) {
        Coupon coupon = couponRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));

        if (coupon.getExpirationDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Coupon has expired");
        }

        if (coupon.getRemainingCount() <= 0) {
            throw new RuntimeException("Coupon has no remaining uses");
        }

        BigDecimal discountAmount = coupon.getDiscountAmount();
        BigDecimal finalAmount = originalAmount.subtract(discountAmount);

        coupon.setRemainingCount(coupon.getRemainingCount() - 1);
        couponRepository.save(coupon);

        CouponUsageLog log = new CouponUsageLog();
        log.setCoupon(coupon);
        log.setOriginalAmount(originalAmount);
        log.setDiscountApplied(discountAmount);
        log.setFinalAmount(finalAmount);
        log.setRemainingAfterUse(coupon.getRemainingCount());
        couponUsageLogRepository.save(log);

        return Map.of(
                "finalAmount", finalAmount,
                "discountApplied", discountAmount,
                "logId", log.getId()
        );
    }
}
