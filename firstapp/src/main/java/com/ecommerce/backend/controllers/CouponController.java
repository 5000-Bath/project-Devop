package com.ecommerce.backend.controllers;

import com.ecommerce.backend.models.Coupon;
import com.ecommerce.backend.models.CouponUsageLog;
import com.ecommerce.backend.repositories.CouponRepository;
import com.ecommerce.backend.repositories.CouponUsageLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private CouponUsageLogRepository couponUsageLogRepository;

    @GetMapping
    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    @GetMapping("/{id}")
    public Coupon getCouponById(@PathVariable Long id) {
        return couponRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));
    }

    @GetMapping("/code/{code}")
    public Coupon getCouponByCode(@PathVariable String code) {
        return couponRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));
    }

    @PostMapping
    public Coupon createCoupon(@RequestBody Coupon coupon) {
        return couponRepository.save(coupon);
    }

    @PutMapping("/{id}")
    public Coupon updateCoupon(@PathVariable Long id, @RequestBody Coupon couponDetails) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));

        coupon.setCode(couponDetails.getCode());
        coupon.setDiscountAmount(couponDetails.getDiscountAmount());
        coupon.setRemainingCount(couponDetails.getRemainingCount());
        coupon.setExpirationDate(couponDetails.getExpirationDate());

        return couponRepository.save(coupon);
    }

    @DeleteMapping("/{id}")
    public void deleteCoupon(@PathVariable Long id) {
        couponRepository.deleteById(id);
    }

    @PostMapping("/use")
    public ResponseEntity<?> useCoupon(@RequestBody Map<String, Object> body) {
        String code = (String) body.get("code");
        BigDecimal originalAmount = new BigDecimal(body.get("originalAmount").toString());

        Coupon coupon = couponRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));

        if (coupon.getExpirationDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Coupon has expired");
        }

        if (coupon.getRemainingCount() <= 0) {
            return ResponseEntity.badRequest().body("Coupon has no remaining uses");
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

        return ResponseEntity.ok(Map.of(
                "finalAmount", finalAmount,
                "discountApplied", discountAmount,
                "logId", log.getId()
        ));
    }
}
