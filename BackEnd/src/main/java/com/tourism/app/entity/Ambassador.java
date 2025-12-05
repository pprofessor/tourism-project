package com.tourism.app.entity;

import com.tourism.app.model.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ambassadors")
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
    
    @ElementCollection
    @CollectionTable(name = "ambassador_languages", joinColumns = @JoinColumn(name = "ambassador_id"))
    @Column(name = "language")
    private List<String> languages = new ArrayList<>();
    
    @ElementCollection
    @CollectionTable(name = "ambassador_services", joinColumns = @JoinColumn(name = "ambassador_id"))
    @Column(name = "service")
    private List<String> services = new ArrayList<>();
    
    @Column(name = "hourly_rate")
    private Double hourlyRate;
    
    private Double rating = 0.0;
    
    @Column(name = "completed_tasks")
    private Integer completedTasks = 0;
    
    @Column(name = "is_available")
    private Boolean isAvailable = true;
    
    @Column(length = 1000)
    private String bio;
    
    @ElementCollection
    @CollectionTable(name = "ambassador_certificates", joinColumns = @JoinColumn(name = "ambassador_id"))
    @Column(name = "certificate")
    private List<String> certificates = new ArrayList<>();
    
    @Column(name = "profile_image")
    private String profileImage;
    
    @Column(name = "whatsapp_number")
    private String whatsappNumber;
    
    @Column(name = "telegram_username")
    private String telegramUsername;
    
    @Column(name = "is_verified")
    private Boolean isVerified = false;
    
    @Column(name = "response_time")
    private Integer responseTime;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // ============ GETTERS ============
    public Long getId() { return id; }
    public User getUser() { return user; }
    public String getCity() { return city; }
    public String getCountry() { return country; }
    public List<String> getLanguages() { return languages; }
    public List<String> getServices() { return services; }
    public Double getHourlyRate() { return hourlyRate; }
    public Double getRating() { return rating; }
    public Integer getCompletedTasks() { return completedTasks; }
    public Boolean getIsAvailable() { return isAvailable; }
    public String getBio() { return bio; }
    public List<String> getCertificates() { return certificates; }
    public String getProfileImage() { return profileImage; }
    public String getWhatsappNumber() { return whatsappNumber; }
    public String getTelegramUsername() { return telegramUsername; }
    public Boolean getIsVerified() { return isVerified; }
    public Integer getResponseTime() { return responseTime; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    
    // ============ SETTERS ============
    public void setId(Long id) { this.id = id; }
    public void setUser(User user) { this.user = user; }
    public void setCity(String city) { this.city = city; }
    public void setCountry(String country) { this.country = country; }
    public void setLanguages(List<String> languages) { this.languages = languages; }
    public void setServices(List<String> services) { this.services = services; }
    public void setHourlyRate(Double hourlyRate) { this.hourlyRate = hourlyRate; }
    public void setRating(Double rating) { this.rating = rating; }
    public void setCompletedTasks(Integer completedTasks) { this.completedTasks = completedTasks; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }
    public void setBio(String bio) { this.bio = bio; }
    public void setCertificates(List<String> certificates) { this.certificates = certificates; }
    public void setProfileImage(String profileImage) { this.profileImage = profileImage; }
    public void setWhatsappNumber(String whatsappNumber) { this.whatsappNumber = whatsappNumber; }
    public void setTelegramUsername(String telegramUsername) { this.telegramUsername = telegramUsername; }
    public void setIsVerified(Boolean isVerified) { this.isVerified = isVerified; }
    public void setResponseTime(Integer responseTime) { this.responseTime = responseTime; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}