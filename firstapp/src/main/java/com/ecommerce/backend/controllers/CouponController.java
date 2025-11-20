package com.ecommerce.backend.controllers;

import com.ecommerce.backend.models.Coupon;
import com.ecommerce.backend.services.CouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
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

    // ใช้ Map แทน Coupon สำหรับ create เพื่อ map ฟิลด์ให้ตรงกับ Entity
    @PostMapping
    public Coupon createCoupon(@RequestBody Map<String, Object> body) {

        Coupon coupon = new Coupon();

        coupon.setCode((String) body.get("code"));

        // discountValue → discountAmount
        if(body.get("discountValue") != null)
            coupon.setDiscountAmount(new BigDecimal(body.get("discountValue").toString()));
        else
            coupon.setDiscountAmount(BigDecimal.ZERO);

        // maxUses → remainingCount
        if (body.get("maxUses") != null)
            coupon.setRemainingCount(Integer.parseInt(body.get("maxUses").toString()));
        else
            coupon.setRemainingCount(0);

        // expiryDate → expirationDate
        if (body.get("expiryDate") != null) {
            String dateStr = body.get("expiryDate").toString().replace("Z", "");
            coupon.setExpirationDate(LocalDateTime.parse(dateStr));
        } else {
            coupon.setExpirationDate(LocalDateTime.now().plusYears(1)); // default 1 ปี
        }

        return couponService.createCoupon(coupon);
    }

    // ใช้ Map แทน Coupon สำหรับ update
    @PutMapping("/{id}")
    public Coupon updateCoupon(@PathVariable Long id, @RequestBody Map<String, Object> body) {

        Map<String, Object> updates = new HashMap<>();

        if(body.get("code") != null)
            updates.put("code", body.get("code"));

        if(body.get("discountValue") != null)
            updates.put("discountAmount", new BigDecimal(body.get("discountValue").toString()));

        if(body.get("maxUses") != null)
            updates.put("remainingCount", Integer.parseInt(body.get("maxUses").toString()));

        if(body.get("expiryDate") != null) {
            String dateStr = body.get("expiryDate").toString().replace("Z", "");
            updates.put("expirationDate", LocalDateTime.parse(dateStr));
        }

        return couponService.updateCoupon(id, updates);
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

                // แก้ไขให้แน่ใจว่ามี key สำหรับ Front-End
                Map<String, Object> response = new HashMap<>();
                response.put("discountAmount", result.get("discountAmount")); // จำนวนส่วนลด
                response.put("newAmount", result.get("newAmount"));           // ราคาหลังหักส่วนลด

                return ResponseEntity.ok(response);
            } catch (RuntimeException e) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        }

}
