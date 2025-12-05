package com.tourism.app.entity;

import com.tourism.app.model.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ambassador_requests")
public class AmbassadorRequest {

    public enum Status {
        PENDING,
        ACCEPTED,
        REJECTED,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED,
        DISPUTED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "tourist_id", nullable = false)
    private User tourist;

    @ManyToOne
    @JoinColumn(name = "ambassador_id", nullable = false)
    private Ambassador ambassador;

    @Column(name = "service_type", nullable = false)
    private String serviceType;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(length = 2000)
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;

    @Column(name = "total_price")
    private Double totalPrice;

    @Column(name = "deposit_paid")
    private Boolean depositPaid = false;

    @Column(name = "full_payment_paid")
    private Boolean fullPaymentPaid = false;

    @Column(name = "tourist_rating")
    private Integer touristRating;

    @Column(name = "tourist_review", length = 1000)
    private String touristReview;

    @Column(name = "ambassador_rating")
    private Integer ambassadorRating;

    @Column(name = "ambassador_review", length = 1000)
    private String ambassadorReview;

    @Column(name = "chat_thread_id")
    private String chatThreadId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ============ GETTERS ============
    public Long getId() {
        return id;
    }

    public User getTourist() {
        return tourist;
    }

    public Ambassador getAmbassador() {
        return ambassador;
    }

    public String getServiceType() {
        return serviceType;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public String getNotes() {
        return notes;
    }

    public Status getStatus() {
        return status;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public Boolean getDepositPaid() {
        return depositPaid;
    }

    public Boolean getFullPaymentPaid() {
        return fullPaymentPaid;
    }

    public Integer getTouristRating() {
        return touristRating;
    }

    public String getTouristReview() {
        return touristReview;
    }

    public Integer getAmbassadorRating() {
        return ambassadorRating;
    }

    public String getAmbassadorReview() {
        return ambassadorReview;
    }

    public String getChatThreadId() {
        return chatThreadId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    // ============ SETTERS ============
    public void setId(Long id) {
        this.id = id;
    }

    public void setTourist(User tourist) {
        this.tourist = tourist;
    }

    public void setAmbassador(Ambassador ambassador) {
        this.ambassador = ambassador;
    }

    public void setServiceType(String serviceType) {
        this.serviceType = serviceType;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public void setDepositPaid(Boolean depositPaid) {
        this.depositPaid = depositPaid;
    }

    public void setFullPaymentPaid(Boolean fullPaymentPaid) {
        this.fullPaymentPaid = fullPaymentPaid;
    }

    public void setTouristRating(Integer touristRating) {
        this.touristRating = touristRating;
    }

    public void setTouristReview(String touristReview) {
        this.touristReview = touristReview;
    }

    public void setAmbassadorRating(Integer ambassadorRating) {
        this.ambassadorRating = ambassadorRating;
    }

    public void setAmbassadorReview(String ambassadorReview) {
        this.ambassadorReview = ambassadorReview;
    }

    public void setChatThreadId(String chatThreadId) {
        this.chatThreadId = chatThreadId;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

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