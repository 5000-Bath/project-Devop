package com.ecommerce.backend.models;

import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class CouponTest {

    @Test
    void testCouponGettersAndSetters() {
        Coupon coupon = new Coupon();
        Long id = 1L;
        String code = "SUMMER25";
        BigDecimal discountAmount = new BigDecimal("50.00");
        int remainingCount = 100;
        LocalDateTime expirationDate = LocalDateTime.now().plusDays(30);

        coupon.setId(id);
        coupon.setCode(code);
        coupon.setDiscountAmount(discountAmount);
        coupon.setRemainingCount(remainingCount);
        coupon.setExpirationDate(expirationDate);

        assertEquals(id, coupon.getId());
        assertEquals(code, coupon.getCode());
        assertEquals(0, discountAmount.compareTo(coupon.getDiscountAmount()));
        assertEquals(remainingCount, coupon.getRemainingCount());
        assertEquals(expirationDate, coupon.getExpirationDate());
    }
}