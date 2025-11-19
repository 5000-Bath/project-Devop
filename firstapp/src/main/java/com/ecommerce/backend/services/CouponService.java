package com.ecommerce.backend.services;

import com.ecommerce.backend.models.Coupon;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface CouponService {
    List<Coupon> getAllCoupons();
    Coupon getCouponById(Long id);
    Coupon getCouponByCode(String code);
    Coupon createCoupon(Coupon coupon);
    Coupon updateCoupon(Long id, Map<String, Object> updates);
    void deleteCoupon(Long id);
    Map<String, Object> useCoupon(String code, BigDecimal originalAmount);
}
