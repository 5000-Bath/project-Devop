package com.ecommerce.backend.services;

import com.ecommerce.backend.models.Coupon;
import com.ecommerce.backend.models.Order;
import com.ecommerce.backend.models.CouponUsageLog;
import com.ecommerce.backend.repositories.CouponRepository;
import com.ecommerce.backend.repositories.CouponUsageLogRepository;
import com.ecommerce.backend.repositories.OrderRepository;
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

    @Autowired
    private OrderRepository orderRepository;

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
    public Map<String, Object> validateCoupon(String code, BigDecimal originalAmount) {
         Coupon coupon = couponRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("ไม่พบคูปองนี้ในระบบ"));

        if (coupon.getExpirationDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("คูปองนี้หมดอายุแล้ว");
        }

        if (coupon.getRemainingCount() <= 0) {
            throw new RuntimeException("คูปองนี้ใช้ครบจำนวนแล้ว");
        }

        BigDecimal discountAmount = coupon.getDiscountAmount();
        BigDecimal finalAmount = originalAmount.subtract(discountAmount);

        return Map.of(
                "finalAmount", finalAmount,
                "discountApplied", discountAmount
        );
    }

    @Override
    public void applyCouponToOrder(Order order) {
        if (order.getCouponCode() == null || order.getCouponCode().isEmpty()) {
            return; // ไม่มีคูปองให้ใช้
        }

        Coupon coupon = couponRepository.findByCode(order.getCouponCode())
                .orElseThrow(() -> new RuntimeException("Coupon not found during order creation"));

        // ลดจำนวนคูปอง
        coupon.setRemainingCount(coupon.getRemainingCount() - 1);
        couponRepository.save(coupon);

        // บันทึก Log
        CouponUsageLog log = new CouponUsageLog();
        log.setCoupon(coupon);
        log.setOrder(order); // ผูกกับ Order ที่สร้างขึ้น
        log.setUserId(order.getUserId());
        log.setOriginalAmount(order.getFinalAmount().add(order.getDiscountAmount())); // คำนวณราคาก่อนลด
        log.setDiscountApplied(order.getDiscountAmount());
        log.setFinalAmount(order.getFinalAmount());
        log.setRemainingAfterUse(coupon.getRemainingCount());
        couponUsageLogRepository.save(log);
    }



}
