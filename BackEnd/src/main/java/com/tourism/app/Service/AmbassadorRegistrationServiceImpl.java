package com.tourism.app.service;

import com.tourism.app.dto.AmbassadorRegistrationDTO;
import com.tourism.app.dto.AmbassadorResponseDTO;
import com.tourism.app.entity.Ambassador;
import com.tourism.app.entity.AmbassadorRequest;
import com.tourism.app.entity.AmbassadorRequest.Status;
import com.tourism.app.model.User;
import com.tourism.app.repository.AmbassadorRepository;
import com.tourism.app.repository.AmbassadorRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class AmbassadorRegistrationServiceImpl implements AmbassadorRegistrationService {

    private final AmbassadorRepository ambassadorRepository;
    private final AmbassadorRequestRepository requestRepository;

    // ============ NEW REGISTRATION METHODS ============

    @Override
    public Map<String, Object> getUserRegistrationStatus(User user) {
        Optional<Ambassador> ambassadorOpt = ambassadorRepository.findByUser(user);

        if (ambassadorOpt.isEmpty()) {
            return Map.of(
                    "hasRegistration", false,
                    "message", "No registration found",
                    "currentStep", 1);
        }

        Ambassador ambassador = ambassadorOpt.get();
        AmbassadorResponseDTO response = AmbassadorResponseDTO.fromEntity(ambassador);

        return Map.of(
                "hasRegistration", true,
                "ambassador", response,
                "currentStep", ambassador.getRegistrationStep(),
                "status", ambassador.getStatus().toString());
    }

    @Override
    public Map<String, Object> saveDraft(User user, AmbassadorRegistrationDTO dto) {
        // اعتبارسنجی
        if (dto.getCurrentStep() == null || dto.getCurrentStep() < 1 || dto.getCurrentStep() > 5) {
            throw new IllegalArgumentException("currentStep must be between 1 and 5");
        }

        // پیدا کردن یا ایجاد سفیر
        Ambassador ambassador = ambassadorRepository.findByUser(user)
                .orElseGet(() -> Ambassador.builder()
                        .user(user)
                        .status(Ambassador.AmbassadorStatus.DRAFT)
                        .registrationStep(1)
                        .isAvailable(false)
                        .isVerified(false)
                        .rating(0.0)
                        .completedTasks(0)
                        .build());

        // به‌روزرسانی داده‌ها بر اساس مرحله
        updateAmbassadorFromDTO(ambassador, dto);

        // به‌روزرسانی مرحله
        ambassador.setRegistrationStep(dto.getCurrentStep());

        // اگر تمام مراحل کامل شد، وضعیت را تغییر بده
        if (dto.isComplete()) {
            ambassador.setStatus(Ambassador.AmbassadorStatus.PENDING_REVIEW);
        }

        ambassadorRepository.save(ambassador);

        return Map.of(
                "success", true,
                "message", "Draft saved successfully",
                "currentStep", ambassador.getRegistrationStep(),
                "status", ambassador.getStatus().toString(),
                "savedAt", LocalDateTime.now());
    }

    @Override
    public Map<String, Object> submitRegistration(User user, AmbassadorRegistrationDTO dto) {
        // بررسی کامل بودن تمام مراحل
        if (!dto.isComplete()) {
            throw new IllegalArgumentException("Please complete all steps before submission");
        }

        Optional<Ambassador> ambassadorOpt = ambassadorRepository.findByUser(user);
        Ambassador ambassador;

        if (ambassadorOpt.isPresent()) {
            ambassador = ambassadorOpt.get();
            updateAmbassadorFromDTO(ambassador, dto);
        } else {
            // ایجاد سفیر جدید
            ambassador = createAmbassadorFromDTO(user, dto);
        }

        // تنظیم وضعیت نهایی
        ambassador.setStatus(Ambassador.AmbassadorStatus.PENDING_REVIEW);
        ambassador.setRegistrationStep(5);
        ambassador.setUpdatedAt(LocalDateTime.now());

        ambassadorRepository.save(ambassador);

        return Map.of(
                "success", true,
                "message", "Registration submitted successfully. It will be reviewed by admin.",
                "submissionDate", LocalDateTime.now(),
                "referenceId", ambassador.getId());
    }

    // ============ HELPER METHODS ============

    private void updateAmbassadorFromDTO(Ambassador ambassador, AmbassadorRegistrationDTO dto) {
        // Step 1: Location
        if (dto.getCountry() != null)
            ambassador.setCountry(dto.getCountry());
        if (dto.getCity() != null)
            ambassador.setCity(dto.getCity());
        if (dto.getAddress() != null)
            ambassador.setAddress(dto.getAddress());
        if (dto.getLatitude() != null)
            ambassador.setLatitude(dto.getLatitude());
        if (dto.getLongitude() != null)
            ambassador.setLongitude(dto.getLongitude());

        // Step 2: Languages
        if (dto.getLanguages() != null) {
            List<String> languages = new ArrayList<>();
            dto.getLanguages().forEach((lang, proficiency) -> {
                languages.add(lang + ":" + proficiency);
            });
            ambassador.setLanguages(languages);
        }

        // Step 3: Services & Bio
        if (dto.getServices() != null)
            ambassador.setServices(dto.getServices());
        if (dto.getBio() != null)
            ambassador.setBio(dto.getBio());
        if (dto.getWorkExperience() != null)
            ambassador.setWorkExperience(dto.getWorkExperience());

        // Step 4: Documents
        if (dto.getVideoSelfieUrl() != null)
            ambassador.setVideoSelfieUrl(dto.getVideoSelfieUrl());

        // Step 5: Agreement
        if (dto.getAgreementAccepted() != null) {
            ambassador.setAgreementAccepted(dto.getAgreementAccepted());
        }
    }

    private Ambassador createAmbassadorFromDTO(User user, AmbassadorRegistrationDTO dto) {
        Ambassador ambassador = Ambassador.builder()
                .user(user)
                .country(dto.getCountry())
                .city(dto.getCity())
                .address(dto.getAddress())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .workExperience(dto.getWorkExperience())
                .bio(dto.getBio())
                .videoSelfieUrl(dto.getVideoSelfieUrl())
                .agreementAccepted(dto.getAgreementAccepted())
                .status(Ambassador.AmbassadorStatus.PENDING_REVIEW)
                .registrationStep(5)
                .isAvailable(false)
                .isVerified(false)
                .rating(0.0)
                .completedTasks(0)
                .build();

        // زبان‌ها
        if (dto.getLanguages() != null) {
            List<String> languages = new ArrayList<>();
            dto.getLanguages().forEach((lang, proficiency) -> {
                languages.add(lang + ":" + proficiency);
            });
            ambassador.setLanguages(languages);
        }

        // سرویس‌ها
        if (dto.getServices() != null) {
            ambassador.setServices(dto.getServices());
        }

        return ambassador;
    }

    // ============ EXISTING METHODS IMPLEMENTATION ============

    @Override
    public List<Ambassador> searchAmbassadors(String city, String country, Double minRate, Double maxRate,
            Double minRating) {
        return ambassadorRepository.searchAmbassadors(city, country, minRate, maxRate, minRating);
    }

    @Override
    public Map<String, Object> getCurrentUserAmbassadorStatus(User currentUser) {
        Optional<Ambassador> ambassadorOpt = ambassadorRepository.findByUser(currentUser);

        if (ambassadorOpt.isEmpty()) {
            return Map.of("status", "NOT_REGISTERED");
        }

        Ambassador ambassador = ambassadorOpt.get();
        Map<String, Object> response = new HashMap<>();
        response.put("status", ambassador.getStatus().toString());
        response.put("ambassador", ambassador);
        response.put("isVerified", ambassador.getIsVerified());
        response.put("createdAt", ambassador.getCreatedAt());

        return response;
    }

    @Override
    public List<Ambassador> getAmbassadorsByCity(String city) {
        return ambassadorRepository.findByCity(city);
    }

    @Override
    public List<Ambassador> getVerifiedAmbassadors() {
        return ambassadorRepository.findByIsVerifiedTrue();
    }

    @Override
    public Ambassador getAmbassadorById(Long id) {
        return ambassadorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ambassador not found with id: " + id));
    }

    @Override
    public Ambassador createAmbassador(User currentUser, Ambassador ambassadorData) {
        // بررسی تکراری نبودن
        if (ambassadorRepository.findByUser(currentUser).isPresent()) {
            throw new RuntimeException("User already has an ambassador profile");
        }

        ambassadorData.setUser(currentUser);
        ambassadorData.setStatus(Ambassador.AmbassadorStatus.PENDING_REVIEW);
        ambassadorData.setIsVerified(false);
        ambassadorData.setCreatedAt(LocalDateTime.now());
        ambassadorData.setUpdatedAt(LocalDateTime.now());

        return ambassadorRepository.save(ambassadorData);
    }

    @Override
    public Ambassador updateAmbassador(Long id, Ambassador ambassadorData, User currentUser) {
        Ambassador existing = getAmbassadorById(id);

        // بررسی مالکیت
        if (!existing.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can only update your own profile");
        }

        // به‌روزرسانی فیلدهای مجاز
        if (ambassadorData.getCity() != null)
            existing.setCity(ambassadorData.getCity());
        if (ambassadorData.getCountry() != null)
            existing.setCountry(ambassadorData.getCountry());
        if (ambassadorData.getLanguages() != null)
            existing.setLanguages(ambassadorData.getLanguages());
        if (ambassadorData.getServices() != null)
            existing.setServices(ambassadorData.getServices());
        if (ambassadorData.getHourlyRate() != null)
            existing.setHourlyRate(ambassadorData.getHourlyRate());
        if (ambassadorData.getBio() != null)
            existing.setBio(ambassadorData.getBio());
        if (ambassadorData.getProfileImage() != null)
            existing.setProfileImage(ambassadorData.getProfileImage());
        if (ambassadorData.getWhatsappNumber() != null)
            existing.setWhatsappNumber(ambassadorData.getWhatsappNumber());
        if (ambassadorData.getTelegramUsername() != null)
            existing.setTelegramUsername(ambassadorData.getTelegramUsername());

        existing.setUpdatedAt(LocalDateTime.now());
        return ambassadorRepository.save(existing);
    }

    @Override
    public Ambassador toggleAvailability(Long id, Boolean available, User currentUser) {
        Ambassador ambassador = getAmbassadorById(id);

        // بررسی مالکیت
        if (!ambassador.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Access denied");
        }

        ambassador.setIsAvailable(available);
        ambassador.setUpdatedAt(LocalDateTime.now());
        return ambassadorRepository.save(ambassador);
    }

    @Override
    public List<AmbassadorRequest> getAmbassadorRequests(Long ambassadorId, User currentUser) {
        Ambassador ambassador = getAmbassadorById(ambassadorId);

        // بررسی مالکیت
        if (!ambassador.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Access denied");
        }

        return requestRepository.findByAmbassador(ambassador);
    }

    @Override
    public Map<String, Object> getAmbassadorStats(Long id) {
        Ambassador ambassador = getAmbassadorById(id);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRequests", ambassador.getCompletedTasks());
        stats.put("rating", ambassador.getRating());
        stats.put("hourlyRate", ambassador.getHourlyRate());
        stats.put("isAvailable", ambassador.getIsAvailable());
        stats.put("languages", ambassador.getLanguages().size());
        stats.put("services", ambassador.getServices().size());

        return stats;
    }
}