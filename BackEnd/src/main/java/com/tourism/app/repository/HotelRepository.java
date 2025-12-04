package com.tourism.app.repository;

import com.tourism.app.model.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {

        // متدهای جدید برای HotelController
        List<Hotel> findByIsActiveTrue();

        List<Hotel> findByCityAndIsActiveTrue(String city);

        List<Hotel> findByCountryAndIsActiveTrue(String country);

        // کوئری برای هتل‌های با اتاق خالی
        @Query("SELECT h FROM Hotel h WHERE h.availableRooms > 0 AND h.isActive = true")
        List<Hotel> findHotelsWithAvailableRooms();

        // کوئری برای هتل‌های با تخفیف فعال
        @Query("SELECT h FROM Hotel h WHERE h.discountPercentage > 0 AND h.discountExpiry > CURRENT_TIMESTAMP AND h.isActive = true")
        List<Hotel> findHotelsWithActiveDiscount();

        // آمار هتل‌های فعال
        @Query("SELECT COUNT(h) FROM Hotel h WHERE h.isActive = true")
        Long countActiveHotels();

        // میانگین قیمت هتل‌های فعال
        @Query("SELECT AVG(h.basePrice) FROM Hotel h WHERE h.isActive = true")
        Double getAveragePrice();

        // کوئری‌های موجود با JOIN FETCH
        @Query("SELECT DISTINCT h FROM Hotel h LEFT JOIN FETCH h.images WHERE h.isActive = true AND h.rating >= 4.0 ORDER BY h.rating DESC")
        List<Hotel> findRecommendedHotels();

        @Query("SELECT DISTINCT h FROM Hotel h LEFT JOIN FETCH h.images WHERE h.isActive = true AND h.reviewCount > 10 ORDER BY h.reviewCount DESC")
        List<Hotel> findPopularHotelsWithImages();

        @Query("SELECT h FROM Hotel h WHERE " +
                        "(:city IS NULL OR h.city = :city) AND " +
                        "(:minPrice IS NULL OR h.basePrice >= :minPrice) AND " +
                        "(:maxPrice IS NULL OR h.basePrice <= :maxPrice) AND " +
                        "(:hasPool IS NULL OR h.hasPool = :hasPool) AND " +
                        "h.isActive = true")
        List<Hotel> searchHotels(@Param("city") String city,
                        @Param("minPrice") Double minPrice,
                        @Param("maxPrice") Double maxPrice,
                        @Param("sortBy") String sortBy,
                        @Param("page") Integer page,
                        @Param("hasPool") Boolean hasPool);

        List<Hotel> findByRatingGreaterThanEqualAndIsActiveTrue(Double minRating);

        Page<Hotel> findByIsActiveTrue(Pageable pageable);

        Page<Hotel> findByCityAndIsActiveTrue(String city, Pageable pageable);

        Page<Hotel> findByCountryAndIsActiveTrue(String country, Pageable pageable);

        @Query("SELECT h FROM Hotel h WHERE h.availableRooms > 0 AND h.isActive = true")
        Page<Hotel> findHotelsWithAvailableRooms(Pageable pageable);

        @Query("SELECT h FROM Hotel h WHERE h.discountPercentage > 0 AND h.discountExpiry > CURRENT_TIMESTAMP AND h.isActive = true")
        Page<Hotel> findHotelsWithActiveDiscount(Pageable pageable);

        // کوئری search با pagination
        @Query("SELECT h FROM Hotel h WHERE " +
                        "(:city IS NULL OR h.city = :city) AND " +
                        "(:minPrice IS NULL OR h.basePrice >= :minPrice) AND " +
                        "(:maxPrice IS NULL OR h.basePrice <= :maxPrice) AND " +
                        "(:hasPool IS NULL OR h.hasPool = :hasPool) AND " +
                        "h.isActive = true")
        Page<Hotel> searchHotelsWithPagination(@Param("city") String city,
                        @Param("minPrice") Double minPrice,
                        @Param("maxPrice") Double maxPrice,
                        @Param("hasPool") Boolean hasPool,
                        Pageable pageable);

        // کوئری جدید برای fetch کردن همه روابط
        @Query("SELECT DISTINCT h FROM Hotel h LEFT JOIN FETCH h.images WHERE h.id = :id")
        Optional<Hotel> findByIdWithImages(@Param("id") Long id);
}