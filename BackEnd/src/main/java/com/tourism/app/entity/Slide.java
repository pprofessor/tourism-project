package com.tourism.app.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "slides")
public class Slide {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, columnDefinition = "TEXT") // تغییر این خط
    private String image;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false, length = 500)
    private String description;
    
    @Column(name = "button_text", nullable = false)
    private String buttonText;
    
    @Column(name = "button_link", nullable = false)
    private String buttonLink;
    
    @Column(name = "is_active")
    private boolean isActive = true;
    
    @Column(name = "sort_order")
    private int sortOrder = 0;
    
    @Column(name = "alt_text")
    private String altText;
    
    @Column(name = "seo_title")
    private String seoTitle;
    
    @Column(name = "seo_description", columnDefinition = "TEXT") // این هم بهتر است تغییر کند
    private String seoDescription;
    
    // Constructors
    public Slide() {}
    
    public Slide(String image, String title, String description, String buttonText, String buttonLink) {
        this.image = image;
        this.title = title;
        this.description = description;
        this.buttonText = buttonText;
        this.buttonLink = buttonLink;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getButtonText() { return buttonText; }
    public void setButtonText(String buttonText) { this.buttonText = buttonText; }
    
    public String getButtonLink() { return buttonLink; }
    public void setButtonLink(String buttonLink) { this.buttonLink = buttonLink; }
    
    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
    
    public int getSortOrder() { return sortOrder; }
    public void setSortOrder(int sortOrder) { this.sortOrder = sortOrder; }
    
    public String getAltText() { return altText; }
    public void setAltText(String altText) { this.altText = altText; }
    
    public String getSeoTitle() { return seoTitle; }
    public void setSeoTitle(String seoTitle) { this.seoTitle = seoTitle; }
    
    public String getSeoDescription() { return seoDescription; }
    public void setSeoDescription(String seoDescription) { this.seoDescription = seoDescription; }
}