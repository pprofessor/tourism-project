package com.tourism.app.repository;

import com.tourism.app.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Payment> findByUserIdAndStatusOrderByCreatedAtDesc(Long userId, String status);
}