package com.tourism.app.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "hotels")
public class Hotel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // اطلاعات اصلی
    private String name;
    private String description;
    private String address;
    private String city;
    private String country;
    private String postalCode;

    // موقعیت جغرافیایی
    private Double latitude;
    private Double longitude;

    // اطلاعات تماس
    private String phone;
    private String email;
    private String website;

    // اطلاعات قیمت و رزرو
    private Double basePrice;
    private Integer totalRooms;
    private Integer availableRooms;
    private Integer starRating;

    // امکانات هتل
    @ElementCollection
    private List<String> amenities;

    // اطلاعات رسانه
    @ElementCollection
    private List<String> imageUrls;
    private String mainImageUrl;

    // قابلیت‌های مدیریتی
    private Boolean isActive;
    private Double discountPercentage;
    private String discountCode;
    private LocalDateTime discountExpiry;

    // اطلاعات سئو
    private String seoTitle;
    private String seoDescription;
    private String seoKeywords;

    // زمان‌بندی
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public Hotel() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.isActive = true;
        this.availableRooms = 0;
        this.totalRooms = 0;
        this.basePrice = 0.0;
        this.starRating = 3;
    }

    public Hotel(String name, String description, String address, String city,
            String country, Double basePrice, Integer totalRooms) {
        this();
        this.name = name;
        this.description = description;
        this.address = address;
        this.city = city;
        this.country = country;
        this.basePrice = basePrice;
        this.totalRooms = totalRooms;
        this.availableRooms = totalRooms;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public Double getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(Double basePrice) {
        this.basePrice = basePrice;
    }

    public Integer getTotalRooms() {
        return totalRooms;
    }

    public void setTotalRooms(Integer totalRooms) {
        this.totalRooms = totalRooms;
    }

    public Integer getAvailableRooms() {
        return availableRooms;
    }

    public void setAvailableRooms(Integer availableRooms) {
        this.availableRooms = availableRooms;
    }

    public Integer getStarRating() {
        return starRating;
    }

    public void setStarRating(Integer starRating) {
        this.starRating = starRating;
    }

    public List<String> getAmenities() {
        return amenities;
    }

    public void setAmenities(List<String> amenities) {
        this.amenities = amenities;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public String getMainImageUrl() {
        return mainImageUrl;
    }

    public void setMainImageUrl(String mainImageUrl) {
        this.mainImageUrl = mainImageUrl;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Double getDiscountPercentage() {
        return discountPercentage;
    }

    public void setDiscountPercentage(Double discountPercentage) {
        this.discountPercentage = discountPercentage;
    }

    public String getDiscountCode() {
        return discountCode;
    }

    public void setDiscountCode(String discountCode) {
        this.discountCode = discountCode;
    }

    public LocalDateTime getDiscountExpiry() {
        return discountExpiry;
    }

    public void setDiscountExpiry(LocalDateTime discountExpiry) {
        this.discountExpiry = discountExpiry;
    }

    public String getSeoTitle() {
        return seoTitle;
    }

    public void setSeoTitle(String seoTitle) {
        this.seoTitle = seoTitle;
    }

    public String getSeoDescription() {
        return seoDescription;
    }

    public void setSeoDescription(String seoDescription) {
        this.seoDescription = seoDescription;
    }

    public String getSeoKeywords() {
        return seoKeywords;
    }

    public void setSeoKeywords(String seoKeywords) {
        this.seoKeywords = seoKeywords;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Helper methods
    public Double getDiscountedPrice() {
        if (discountPercentage != null && discountPercentage > 0) {
            return basePrice * (1 - discountPercentage / 100);
        }
        return basePrice;
    }

    public Boolean hasAvailableRooms() {
        return availableRooms > 0;
    }

    public Boolean isDiscountActive() {
        return discountExpiry != null && LocalDateTime.now().isBefore(discountExpiry);
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}