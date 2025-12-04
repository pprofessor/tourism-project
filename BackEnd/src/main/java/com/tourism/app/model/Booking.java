package com.tourism.app.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long userId;
    private String bookingType; // HOTEL, TOUR, TICKET
    private String bookingId;
    private String status; // CONFIRMED, PENDING, CANCELLED, COMPLETED
    
    // اطلاعات سرویس
    private String serviceName;
    private String serviceDescription;
    private BigDecimal price;
    private String currency = "IRT";
    
    // تاریخ‌ها
    private String checkInDate;
    private String checkOutDate;
    private String bookingDate;
    
    // اطلاعات اضافی
    private Integer guests = 1;
    private String specialRequests;
    
    private String createdAt;
    private String updatedAt;
    
    public Booking() {}
    
    public Booking(Long userId, String bookingType, String serviceName, BigDecimal price) {
        this.userId = userId;
        this.bookingType = bookingType;
        this.serviceName = serviceName;
        this.price = price;
        this.status = "CONFIRMED";
        this.bookingDate = java.time.LocalDateTime.now().toString();
        this.createdAt = java.time.LocalDateTime.now().toString();
        this.updatedAt = java.time.LocalDateTime.now().toString();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public String getBookingType() { return bookingType; }
    public void setBookingType(String bookingType) { this.bookingType = bookingType; }
    
    public String getBookingId() { return bookingId; }
    public void setBookingId(String bookingId) { this.bookingId = bookingId; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }
    
    public String getServiceDescription() { return serviceDescription; }
    public void setServiceDescription(String serviceDescription) { this.serviceDescription = serviceDescription; }
    
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    
    public String getCheckInDate() { return checkInDate; }
    public void setCheckInDate(String checkInDate) { this.checkInDate = checkInDate; }
    
    public String getCheckOutDate() { return checkOutDate; }
    public void setCheckOutDate(String checkOutDate) { this.checkOutDate = checkOutDate; }
    
    public String getBookingDate() { return bookingDate; }
    public void setBookingDate(String bookingDate) { this.bookingDate = bookingDate; }
    
    public Integer getGuests() { return guests; }
    public void setGuests(Integer guests) { this.guests = guests; }
    
    public String getSpecialRequests() { return specialRequests; }
    public void setSpecialRequests(String specialRequests) { this.specialRequests = specialRequests; }
    
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    
    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
}