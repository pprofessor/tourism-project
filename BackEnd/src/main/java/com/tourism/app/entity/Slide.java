package com.tourism.app.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "slides")
public class Slide {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    private String description;
    private String image; // تغییر از imageUrl به image
    private String buttonLink;
    private String buttonText = "مشاهده بیشتر";
    private String altText = "";
    private String seoTitle = "";
    private String seoDescription = "";
    
    // فیلدهای جدید برای قابلیت‌های پیشرفته
    private String slideType = "IMAGE";
    private String mediaSource = "UPLOAD";
    private String transitionType = "fade";
    private String navigationType = "dots_arrows";
    private String customNavigation = "default";
    
    private Integer displayOrder = 0;
    private Integer slideInterval = 5000;
    private Integer transitionDuration = 500;
    
    private Boolean isActive = true;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors
    public Slide() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public Slide(String title, String description, String image) { // تغییر از imageUrl به image
        this();
        this.title = title;
        this.description = description;
        this.image = image; // تغییر از imageUrl به image
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getImage() { return image; } 
    public void setImage(String image) { this.image = image; } // تغییر از setImageUrl
    
    public String getButtonLink() { return buttonLink; }
    public void setButtonLink(String buttonLink) { this.buttonLink = buttonLink; }
    
    public String getButtonText() { return buttonText; }
    public void setButtonText(String buttonText) { this.buttonText = buttonText; }
    
    public String getAltText() { return altText; }
    public void setAltText(String altText) { this.altText = altText; }
    
    public String getSeoTitle() { return seoTitle; }
    public void setSeoTitle(String seoTitle) { this.seoTitle = seoTitle; }
    
    public String getSeoDescription() { return seoDescription; }
    public void setSeoDescription(String seoDescription) { this.seoDescription = seoDescription; }
    
    public String getSlideType() { return slideType; }
    public void setSlideType(String slideType) { this.slideType = slideType; }
    
    public String getMediaSource() { return mediaSource; }
    public void setMediaSource(String mediaSource) { this.mediaSource = mediaSource; }
    
    public String getTransitionType() { return transitionType; }
    public void setTransitionType(String transitionType) { this.transitionType = transitionType; }
    
    public String getNavigationType() { return navigationType; }
    public void setNavigationType(String navigationType) { this.navigationType = navigationType; }
    
    public String getCustomNavigation() { return customNavigation; }
    public void setCustomNavigation(String customNavigation) { this.customNavigation = customNavigation; }
    
    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
    
    public Integer getSlideInterval() { return slideInterval; }
    public void setSlideInterval(Integer slideInterval) { this.slideInterval = slideInterval; }
    
    public Integer getTransitionDuration() { return transitionDuration; }
    public void setTransitionDuration(Integer transitionDuration) { this.transitionDuration = transitionDuration; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}