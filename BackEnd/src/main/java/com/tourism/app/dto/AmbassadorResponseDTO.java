package com.tourism.app.dto;

import com.tourism.app.entity.Ambassador;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class AmbassadorResponseDTO {
    private Long id;
    private String city;
    private String country;
    private String address;
    private List<String> languages;
    private List<String> services;
    private Double hourlyRate;
    private Double rating;
    private String bio;
    private String workExperience;
    private String profileImage;
    private Boolean isAvailable;
    private Boolean isVerified;
    private Integer responseTime;
    private String status;
    private LocalDateTime createdAt;
    private UserInfoDTO user;

    @Data
    public static class UserInfoDTO {
        private Long id;
        private String firstName;
        private String lastName;
        private String email;
    }

    public static AmbassadorResponseDTO fromEntity(Ambassador ambassador) {
        if (ambassador == null)
            return null;

        AmbassadorResponseDTO dto = new AmbassadorResponseDTO();
        dto.setId(ambassador.getId());
        dto.setCity(ambassador.getCity());
        dto.setCountry(ambassador.getCountry());
        dto.setAddress(ambassador.getAddress());
        dto.setLanguages(ambassador.getLanguages());
        dto.setServices(ambassador.getServices());
        dto.setHourlyRate(ambassador.getHourlyRate());
        dto.setRating(ambassador.getRating());
        dto.setBio(ambassador.getBio());
        dto.setWorkExperience(ambassador.getWorkExperience());
        dto.setProfileImage(ambassador.getProfileImage());
        dto.setIsAvailable(ambassador.getIsAvailable());
        dto.setIsVerified(ambassador.getIsVerified());
        dto.setResponseTime(ambassador.getResponseTime());
        dto.setStatus(ambassador.getStatus().toString());
        dto.setCreatedAt(ambassador.getCreatedAt());

        if (ambassador.getUser() != null) {
            UserInfoDTO userInfo = new UserInfoDTO();
            userInfo.setId(ambassador.getUser().getId());
            userInfo.setFirstName(ambassador.getUser().getFirstName());
            userInfo.setLastName(ambassador.getUser().getLastName());
            userInfo.setEmail(ambassador.getUser().getEmail());
            dto.setUser(userInfo);
        }

        return dto;
    }
}