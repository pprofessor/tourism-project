package com.tourism.app.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "phone")
    private String phone;

    @Column(unique = true)
    private String mobile;

    private String username;
    private String email;
    private String password;
    private String role = "USER";
    private String userType = "GUEST";
    private String verificationCode;
    private String ambassadorCode;
    private Integer referredCount = 0;
    private String profileImage;

    private String firstName;
    private String lastName;
    private String nationalCode;
    private String passportNumber;
    private String address;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean emailVerified = false;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        // منطق ایمن برای phone و mobile
        if (this.phone == null && this.mobile != null) {
            this.phone = this.mobile;
        }

        if (this.mobile == null && this.phone != null) {
            this.mobile = this.phone;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getter and Setter methods
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        // اگر phone null یا خالی هست، فقط null ست کن
        if (phone == null || phone.trim().isEmpty()) {
            this.phone = null;
            return;
        }

        // فقط اگر مقدار معتبر داره، process کن
        String cleanedPhone = phone.replaceAll("[^0-9]", "");

        // استانداردسازی: همیشه بدون صفر ذخیره کن
        if (cleanedPhone.startsWith("0")) {
            cleanedPhone = cleanedPhone.substring(1);
        }

        this.phone = cleanedPhone;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        // اگر mobile null یا خالی هست، فقط null ست کن
        if (mobile == null || mobile.trim().isEmpty()) {
            this.mobile = null;
            return;
        }

        // فقط اگر مقدار معتبر داره، process کن
        String cleanedMobile = mobile.replaceAll("[^0-9]", "");

        // استانداردسازی: همیشه بدون صفر ذخیره کن
        if (cleanedMobile.startsWith("0")) {
            cleanedMobile = cleanedMobile.substring(1);
        }

        this.mobile = cleanedMobile;

        // اگر phone null است، mobile رو برای phone هم ست کن
        if (this.phone == null) {
            this.phone = this.mobile;
        }
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }

    public String getAmbassadorCode() {
        return ambassadorCode;
    }

    public void setAmbassadorCode(String ambassadorCode) {
        this.ambassadorCode = ambassadorCode;
    }

    public Integer getReferredCount() {
        return referredCount;
    }

    public void setReferredCount(Integer referredCount) {
        this.referredCount = referredCount;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getNationalCode() {
        return nationalCode;
    }

    public void setNationalCode(String nationalCode) {
        this.nationalCode = nationalCode;
    }

    public String getPassportNumber() {
        return passportNumber;
    }

    public void setPassportNumber(String passportNumber) {
        this.passportNumber = passportNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
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

    public boolean isEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(boolean emailVerified) {
        this.emailVerified = emailVerified;
    }
}