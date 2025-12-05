package com.tourism.app.repository;

import com.tourism.app.entity.Ambassador;
import com.tourism.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AmbassadorRepository extends JpaRepository<Ambassador, Long> {

    // پیدا کردن سفیر بر اساس کاربر
    Optional<Ambassador> findByUser(User user);

    // پیدا کردن سفیر بر اساس شهر
    List<Ambassador> findByCity(String city);

    // پیدا کردن سفیر بر اساس کشور
    List<Ambassador> findByCountry(String country);

    // پیدا کردن سفیرهای available در یک شهر
    List<Ambassador> findByCityAndIsAvailableTrue(String city);

    // پیدا کردن سفیرهایی که service خاصی ارائه می‌دهند
    @Query("SELECT a FROM Ambassador a WHERE :service MEMBER OF a.services")
    List<Ambassador> findByService(@Param("service") String service);

    // پیدا کردن سفیرهایی که language خاصی دارند
    @Query("SELECT a FROM Ambassador a WHERE :language MEMBER OF a.languages")
    List<Ambassador> findByLanguage(@Param("language") String language);

    // جستجوی پیشرفته سفیران
    @Query("SELECT a FROM Ambassador a WHERE " +
            "(:city IS NULL OR a.city = :city) AND " +
            "(:country IS NULL OR a.country = :country) AND " +
            "(:minRate IS NULL OR a.hourlyRate >= :minRate) AND " +
            "(:maxRate IS NULL OR a.hourlyRate <= :maxRate) AND " +
            "(:minRating IS NULL OR a.rating >= :minRating) AND " +
            "a.isAvailable = true")
    List<Ambassador> searchAmbassadors(
            @Param("city") String city,
            @Param("country") String country,
            @Param("minRate") Double minRate,
            @Param("maxRate") Double maxRate,
            @Param("minRating") Double minRating);

    // سفیران verified
    List<Ambassador> findByIsVerifiedTrue();

    // سفیران با امتیاز بالا
    List<Ambassador> findByRatingGreaterThanEqual(Double minRating);
}