package com.tourism.app.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "slider_settings")
public class SliderSettings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "slider_height")
    private String sliderHeight = "600px";

    @Column(name = "auto_play")
    private Boolean autoPlay = true;

    @Column(name = "slide_interval")
    private Integer slideInterval = 5000;

    @Column(name = "navigation_type")
    private String navigationType = "dots_arrows";

    @Column(name = "transition_type")
    private String transitionType = "fade";

    @Column(name = "transition_duration")
    private Integer transitionDuration = 500;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public SliderSettings() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSliderHeight() {
        return sliderHeight;
    }

    public void setSliderHeight(String sliderHeight) {
        this.sliderHeight = sliderHeight;
    }

    public Boolean getAutoPlay() {
        return autoPlay;
    }

    public void setAutoPlay(Boolean autoPlay) {
        this.autoPlay = autoPlay;
    }

    public Integer getSlideInterval() {
        return slideInterval;
    }

    public void setSlideInterval(Integer slideInterval) {
        this.slideInterval = slideInterval;
    }

    public String getNavigationType() {
        return navigationType;
    }

    public void setNavigationType(String navigationType) {
        this.navigationType = navigationType;
    }

    public String getTransitionType() {
        return transitionType;
    }

    public void setTransitionType(String transitionType) {
        this.transitionType = transitionType;
    }

    public Integer getTransitionDuration() {
        return transitionDuration;
    }

    public void setTransitionDuration(Integer transitionDuration) {
        this.transitionDuration = transitionDuration;
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
}