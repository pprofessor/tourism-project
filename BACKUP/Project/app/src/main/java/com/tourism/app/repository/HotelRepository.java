package com.tourism.app.repository;

import com.tourism.app.model.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;

public interface HotelRepository extends JpaRepository<Hotel, Long> {
    
    // متد موجود (اگر از قبل داری)
    Optional<Hotel> findByName(String name);
    
    // متد جدید برای آمار
    @Query("SELECT AVG(h.price) FROM Hotel h")
    Double getAveragePrice();
}