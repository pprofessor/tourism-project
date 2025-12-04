package com.tourism.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class AuthRequest {

    @NotBlank(message = "شماره موبایل الزامی است")
    @Pattern(regexp = "^[0-9+\\s\\-\\(\\)]{10,15}$", message = "فرمت شماره موبایل معتبر نیست")
    private String mobile;

    @Size(min = 6, max = 6, message = "کد تایید باید ۶ رقم باشد")
    private String code;

    @Size(min = 4, message = "رمز عبور باید حداقل ۴ کاراکتر باشد")
    private String password;

    // Constructors
    public AuthRequest() {
    }

    public AuthRequest(String mobile, String code, String password) {
        this.mobile = mobile;
        this.code = code;
        this.password = password;
    }

    // Getters and Setters
    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}