package com.ecommerce.backend.controllers;

import com.ecommerce.backend.models.Coupon;
import com.ecommerce.backend.services.CouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {

    @Autowired
    private CouponService couponService;

    @GetMapping
    public List<Coupon> getAllCoupons() {
        return couponService.getAllCoupons();
    }

    @GetMapping("/{id}")
    public Coupon getCouponById(@PathVariable Long id) {
        return couponService.getCouponById(id);
    }

    @GetMapping("/code/{code}")
    public Coupon getCouponByCode(@PathVariable String code) {
        return couponService.getCouponByCode(code);
    }

    @PostMapping
    public Coupon createCoupon(@RequestBody Coupon coupon) {
        return couponService.createCoupon(coupon);
    }

    @PutMapping("/{id}")
    public Coupon updateCoupon(@PathVariable Long id, @RequestBody Map<String, Object> couponDetails) {
        return couponService.updateCoupon(id, couponDetails);
    }

    @DeleteMapping("/{id}")
    public void deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
    }

    @PostMapping("/use")
    public ResponseEntity<?> useCoupon(@RequestBody Map<String, Object> body) {
        String code = (String) body.get("code");
        BigDecimal originalAmount = new BigDecimal(body.get("originalAmount").toString());

        try {
            Map<String, Object> result = couponService.useCoupon(code, originalAmount);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
