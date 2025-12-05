package com.tourism.app.repository;

import com.tourism.app.entity.Ambassador;
import com.tourism.app.entity.AmbassadorRequest;
import com.tourism.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AmbassadorRequestRepository extends JpaRepository<AmbassadorRequest, Long> {

    // درخواست‌های یک توریست
    List<AmbassadorRequest> findByTourist(User tourist);

    // درخواست‌های یک سفیر
    List<AmbassadorRequest> findByAmbassador(Ambassador ambassador);

    // درخواست‌های بر اساس وضعیت
    List<AmbassadorRequest> findByStatus(AmbassadorRequest.Status status);

    // درخواست‌های یک توریست با وضعیت خاص
    List<AmbassadorRequest> findByTouristAndStatus(User tourist, AmbassadorRequest.Status status);

    // درخواست‌های یک سفیر با وضعیت خاص
    List<AmbassadorRequest> findByAmbassadorAndStatus(Ambassador ambassador, AmbassadorRequest.Status status);

    // بررسی تداخل زمانی برای سفیر
    @Query("SELECT CASE WHEN COUNT(ar) > 0 THEN true ELSE false END " +
            "FROM AmbassadorRequest ar " +
            "WHERE ar.ambassador = :ambassador " +
            "AND ar.status IN (com.tourism.app.entity.AmbassadorRequest.Status.ACCEPTED, " +
            "com.tourism.app.entity.AmbassadorRequest.Status.IN_PROGRESS) " +
            "AND ((ar.startTime <= :endTime AND ar.endTime >= :startTime))")
    boolean hasTimeConflict(
            @Param("ambassador") Ambassador ambassador,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);

    // آمار درخواست‌های یک سفیر
    @Query("SELECT COUNT(ar) FROM AmbassadorRequest ar WHERE ar.ambassador = :ambassador")
    Long countByAmbassador(@Param("ambassador") Ambassador ambassador);

    @Query("SELECT COUNT(ar) FROM AmbassadorRequest ar WHERE ar.ambassador = :ambassador AND ar.status = 'COMPLETED'")
    Long countCompletedByAmbassador(@Param("ambassador") Ambassador ambassador);
}