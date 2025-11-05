package com.ecommerce.backend.repositories;

import com.ecommerce.backend.models.CouponUsageLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CouponUsageLogRepository extends JpaRepository<CouponUsageLog, Long> {
}
