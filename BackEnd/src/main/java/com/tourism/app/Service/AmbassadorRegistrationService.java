package com.tourism.app.service;

import com.tourism.app.dto.AmbassadorRegistrationDTO;
import com.tourism.app.entity.Ambassador;
import com.tourism.app.entity.AmbassadorRequest;
import com.tourism.app.model.User;
import java.util.List;
import java.util.Map;

public interface AmbassadorRegistrationService {

    // ============ NEW REGISTRATION METHODS ============

    /**
     * دریافت وضعیت ثبت‌نام کاربر
     */
    Map<String, Object> getUserRegistrationStatus(User user);

    /**
     * ذخیره موقت اطلاعات ثبت‌نام
     */
    Map<String, Object> saveDraft(User user, AmbassadorRegistrationDTO dto);

    /**
     * ارسال نهایی فرم ثبت‌نام
     */
    Map<String, Object> submitRegistration(User user, AmbassadorRegistrationDTO dto);

    // ============ EXISTING METHODS (from old service) ============

    List<Ambassador> searchAmbassadors(String city, String country, Double minRate, Double maxRate, Double minRating);

    Map<String, Object> getCurrentUserAmbassadorStatus(User currentUser);

    List<Ambassador> getAmbassadorsByCity(String city);

    List<Ambassador> getVerifiedAmbassadors();

    Ambassador getAmbassadorById(Long id);

    Ambassador createAmbassador(User currentUser, Ambassador ambassadorData);

    Ambassador updateAmbassador(Long id, Ambassador ambassadorData, User currentUser);

    Ambassador toggleAvailability(Long id, Boolean available, User currentUser);

    List<AmbassadorRequest> getAmbassadorRequests(Long ambassadorId, User currentUser);

    Map<String, Object> getAmbassadorStats(Long id);
}