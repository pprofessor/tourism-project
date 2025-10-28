
package com.tourism.app.repository;

import com.tourism.app.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Booking> findByUserIdAndBookingTypeOrderByCreatedAtDesc(Long userId, String bookingType);
    List<Booking> findByUserIdAndStatusOrderByCreatedAtDesc(Long userId, String status);
}