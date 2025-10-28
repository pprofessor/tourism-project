package com.tourism.app.model;

import jakarta.persistence.*;

@Entity
@Table(name = "hotels")
public class Hotel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String location;
    private Double price;
    private String imageUrl; // فیلد جدید برای آدرس عکس
    
    // Constructors
    public Hotel() {}
    
    public Hotel(String name, String location, Double price, String imageUrl) {
        this.name = name;
        this.location = location;
        this.price = price;
        this.imageUrl = imageUrl;
    }
    
    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getLocation() { return location; }
    public Double getPrice() { return price; }
    public String getImageUrl() { return imageUrl; } // getter جدید
    
    // Setters  
    public void setName(String name) { this.name = name; }
    public void setLocation(String location) { this.location = location; }
    public void setPrice(Double price) { this.price = price; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; } // setter جدید
}