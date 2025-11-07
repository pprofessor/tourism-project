package com.tourism.app.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String email;
    private String mobile;
    private String password;
    private String role;

    // فیلدهای جدید
    private String userType = "GUEST"; // GUEST, VERIFIED, AMBASSADOR
    private boolean emailVerified = false;
    private String verificationCode;
    private String ambassadorCode;
    private Integer referredCount = 0;

    // فیلدهای اطلاعات هویتی
    private String profileImage;
    private String firstName;
    private String lastName;
    private String nationalCode;
    private String passportNumber;
    private String address;

    // فیلدهای زمانی
    private String createdAt;
    private String updatedAt;

    public User() {
    }

    public User(String username, String email, String mobile, String password, String role) {
        this.username = username;
        this.email = email;
        this.mobile = mobile;
        this.password = password;
        this.role = role;
        this.userType = "GUEST";
        this.createdAt = java.time.LocalDateTime.now().toString();
        this.updatedAt = java.time.LocalDateTime.now().toString();
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getMobile() {
        return mobile;
    }

    public String getPassword() {
        return password;
    }

    public String getRole() {
        return role;
    }

    public String getUserType() {
        return userType;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public String getAmbassadorCode() {
        return ambassadorCode;
    }

    public Integer getReferredCount() {
        return referredCount;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getNationalCode() {
        return nationalCode;
    }

    public String getPassportNumber() {
        return passportNumber;
    }

    public String getAddress() {
        return address;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    @JsonProperty("emailVerified")
    public boolean isEmailVerified() {
        return emailVerified;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setUsername(String username) {
        this.username = username;
        this.updatedAt = java.time.LocalDateTime.now().toString();
    }

    public void setEmail(String email) {
        this.email = email;
        this.updatedAt = java.time.LocalDateTime.now().toString();
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
        this.updatedAt = java.time.LocalDateTime.now().toString();
    }

    public void setPassword(String password) {
        this.password = password;
        this.updatedAt = java.time.LocalDateTime.now().toString();
    }

    public void setRole(String role) {
        this.role = role;
        this.updatedAt = java.time.LocalDateTime.now().toString();
    }

    public void setUserType(String userType) {
        this.userType = userType;
        this.updatedAt = java.time.LocalDateTime.now().toString();
    }

    public void setEmailVerified(boolean emailVerified) {
        this.emailVerified = emailVerified;
        this.updatedAt = java.time.LocalDateTime.now().toString();
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
        this.updatedAt = java.time.LocalDateTime.now().toString();
    }

    public void setAmbassadorCode(String ambassadorCode) {
        this.ambassadorCode = ambassadorCode;
        this.updatedAt = java.time.LocalDateTime.now().toString();
    }

    public void setReferredCount(Integer referredCount) {
        this.referredCount = referredCount;
        this.updatedAt = java.time.LocalDateTime.now().toString();
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
        this.updatedAt = java.time.LocalDateTime.now().toString();
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
        this.updatedAt = java.time.LocalDateTime.now().toString();
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
        this.updatedAt = java.time.LocalDateTime.now().toString();
    }

    public void setNationalCode(String nationalCode) {
        this.nationalCode = nationalCode;
        this.updatedAt = java.time.LocalDateTime.now().toString();
    }

    public void setPassportNumber(String passportNumber) {
        this.passportNumber = passportNumber;
        this.updatedAt = java.time.LocalDateTime.now().toString();
    }

    public void setAddress(String address) {
        this.address = address;
        this.updatedAt = java.time.LocalDateTime.now().toString();
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }
}