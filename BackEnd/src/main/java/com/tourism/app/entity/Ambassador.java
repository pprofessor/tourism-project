package com.tourism.app.entity;

import com.tourism.app.model.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ambassadors")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ambassador {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String country;

    @Column(name = "address", length = 500)
    private String address;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @ElementCollection
    @CollectionTable(name = "ambassador_languages", joinColumns = @JoinColumn(name = "ambassador_id"))
    @Column(name = "language")
    @Builder.Default
    private List<String> languages = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "ambassador_services", joinColumns = @JoinColumn(name = "ambassador_id"))
    @Column(name = "service")
    @Builder.Default
    private List<String> services = new ArrayList<>();

    @Column(name = "hourly_rate")
    private Double hourlyRate;

    @Builder.Default
    private Double rating = 0.0;

    @Column(name = "completed_tasks")
    @Builder.Default
    private Integer completedTasks = 0;

    @Column(name = "is_available")
    @Builder.Default
    private Boolean isAvailable = true;

    @Column(length = 1000)
    private String bio;

    @Column(name = "work_experience", length = 2000)
    private String workExperience;

    @ElementCollection
    @CollectionTable(name = "ambassador_certificates", joinColumns = @JoinColumn(name = "ambassador_id"))
    @Column(name = "certificate")
    @Builder.Default
    private List<String> certificates = new ArrayList<>();

    @Column(name = "profile_image")
    private String profileImage;

    @Column(name = "video_selfie_url")
    private String videoSelfieUrl;

    @Column(name = "whatsapp_number")
    private String whatsappNumber;

    @Column(name = "telegram_username")
    private String telegramUsername;

    @Column(name = "is_verified")
    @Builder.Default
    private Boolean isVerified = false;

    @Column(name = "response_time")
    private Integer responseTime;

    public enum AmbassadorStatus {
        DRAFT,
        PENDING_REVIEW,
        APPROVED,
        REJECTED
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private AmbassadorStatus status = AmbassadorStatus.DRAFT;

    @Column(name = "agreement_accepted")
    @Builder.Default
    private Boolean agreementAccepted = false;

    @Column(name = "registration_step")
    @Builder.Default
    private Integer registrationStep = 1;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // متدهای کمکی (اختیاری - می‌توانید نگه دارید)
    public boolean isActiveAndVerified() {
        return status == AmbassadorStatus.APPROVED && isVerified;
    }

    public boolean canAcceptRequests() {
        return isActiveAndVerified() && isAvailable;
    }

    public void addLanguage(String language) {
        if (!this.languages.contains(language)) {
            this.languages.add(language);
        }
    }

    public void addService(String service) {
        if (!this.services.contains(service)) {
            this.services.add(service);
        }
    }
}