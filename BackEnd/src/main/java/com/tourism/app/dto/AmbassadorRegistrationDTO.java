package com.tourism.app.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class AmbassadorRegistrationDTO {
    // Step 1
    private String country;
    private String city;
    private String address;
    private Double latitude;
    private Double longitude;

    // Step 2
    private Map<String, Integer> languages;

    // Step 3
    private List<String> services;
    private String bio;
    private String workExperience;

    // Step 4
    private String videoSelfieUrl;
    private List<DocumentDTO> documents;

    // Step 5
    private Boolean agreementAccepted;

    // Metadata
    private Integer currentStep;
    private String registrationStatus;

    @Data
    public static class DocumentDTO {
        private String type;
        private String url;
        private String fileName;
        private Long fileSize;
    }

    // متدهای کمکی
    public boolean isStep1Complete() {
        return country != null && !country.trim().isEmpty() &&
                city != null && !city.trim().isEmpty() &&
                address != null && !address.trim().isEmpty();
    }

    public boolean isStep2Complete() {
        return languages != null && !languages.isEmpty();
    }

    public boolean isStep3Complete() {
        return services != null && !services.isEmpty() &&
                workExperience != null && !workExperience.trim().isEmpty();
    }

    public boolean isStep4Complete() {
        return videoSelfieUrl != null && !videoSelfieUrl.trim().isEmpty();
    }

    public boolean isStep5Complete() {
        return Boolean.TRUE.equals(agreementAccepted);
    }

    public boolean isComplete() {
        return isStep1Complete() && isStep2Complete() &&
                isStep3Complete() && isStep4Complete() &&
                isStep5Complete();
    }
}