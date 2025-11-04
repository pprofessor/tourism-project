package com.tourism.app.repository;

import com.tourism.app.model.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface HotelRepository extends JpaRepository<Hotel, Long> {
    
    // جستجو بر اساس نام
    Optional<Hotel> findByName(String name);
    
    // جستجو بر اساس شهر
    List<Hotel> findByCity(String city);
    
    // جستجو بر اساس کشور
    List<Hotel> findByCountry(String country);
    
    // جستجو بر اساس رتبه ستاره
    List<Hotel> findByStarRating(Integer starRating);
    
    // جستجو بر اساس فعال/غیرفعال
    List<Hotel> findByIsActive(Boolean isActive);
    
    // جستجو بر اساس محدوده قیمت
    @Query("SELECT h FROM Hotel h WHERE h.basePrice BETWEEN :minPrice AND :maxPrice AND h.isActive = true")
    List<Hotel> findByPriceRange(@Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice);
    
    // جستجو بر اساس شهر و محدوده قیمت
    @Query("SELECT h FROM Hotel h WHERE h.city = :city AND h.basePrice BETWEEN :minPrice AND :maxPrice AND h.isActive = true")
    List<Hotel> findByCityAndPriceRange(@Param("city") String city, @Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice);
    
    // جستجو هتل‌های دارای اتاق خالی
    @Query("SELECT h FROM Hotel h WHERE h.availableRooms > 0 AND h.isActive = true")
    List<Hotel> findHotelsWithAvailableRooms();
    
    // جستجو هتل‌های دارای تخفیف فعال
    @Query("SELECT h FROM Hotel h WHERE h.discountPercentage > 0 AND h.discountExpiry > CURRENT_TIMESTAMP AND h.isActive = true")
    List<Hotel> findHotelsWithActiveDiscount();
    
    // جستجو بر اساس امکانات
    @Query("SELECT h FROM Hotel h WHERE :amenity MEMBER OF h.amenities AND h.isActive = true")
    List<Hotel> findByAmenity(@Param("amenity") String amenity);
    
    // میانگین قیمت هتل‌ها
    @Query("SELECT AVG(h.basePrice) FROM Hotel h WHERE h.isActive = true")
    Double getAveragePrice();
    
    // تعداد هتل‌های فعال
    @Query("SELECT COUNT(h) FROM Hotel h WHERE h.isActive = true")
    Long countActiveHotels();
    
    // جستجوی پیشرفته با فیلترهای مختلف
    @Query("SELECT h FROM Hotel h WHERE " +
           "(:city IS NULL OR h.city = :city) AND " +
           "(:minPrice IS NULL OR h.basePrice >= :minPrice) AND " +
           "(:maxPrice IS NULL OR h.basePrice <= :maxPrice) AND " +
           "(:minRating IS NULL OR h.starRating >= :minRating) AND " +
           "(:hasAvailableRooms IS NULL OR h.availableRooms > 0) AND " +
           "h.isActive = true")
    List<Hotel> searchHotels(
        @Param("city") String city,
        @Param("minPrice") Double minPrice,
        @Param("maxPrice") Double maxPrice,
        @Param("minRating") Integer minRating,
        @Param("hasAvailableRooms") Boolean hasAvailableRooms
    );
    
    // هتل‌های دارای کد تخفیف خاص
    List<Hotel> findByDiscountCode(String discountCode);
}