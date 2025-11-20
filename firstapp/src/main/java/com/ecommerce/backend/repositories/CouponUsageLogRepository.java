package com.ecommerce.backend.repositories;

import com.ecommerce.backend.models.CouponUsageLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CouponUsageLogRepository extends JpaRepository<CouponUsageLog, Long> {

    @Query("SELECT c FROM CouponUsageLog c WHERE c.userId = :userId AND c.coupon.code = :couponCode AND c.order IS NULL")
    List<CouponUsageLog> findUnlinkedByUserIdAndCouponCode(@Param("userId") Long userId, @Param("couponCode") String couponCode);

}