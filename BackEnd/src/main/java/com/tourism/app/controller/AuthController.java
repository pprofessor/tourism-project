package com.tourism.app.controller;

import com.tourism.app.model.User;
import com.tourism.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    private String standardizeMobile(String mobile) {
        if (mobile == null)
            return null;
        String cleaned = mobile.replaceAll("[^0-9]", "");
        return (cleaned.length() == 10 && cleaned.startsWith("9")) ? "0" + cleaned : cleaned;
    }

    @PostMapping("/init-login")
    public Map<String, Object> initLogin(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String mobile = standardizeMobile(request.get("mobile"));

            if (mobile == null || mobile.length() != 11 || !mobile.startsWith("09")) {
                response.put("success", false);
                response.put("message", "شماره موبایل معتبر نیست");
                return response;
            }

            boolean userExists = userRepository.findByMobile(mobile).isPresent();
            response.put("success", true);
            response.put("userExists", userExists);
            response.put("message", userExists ? "کاربر موجود است" : "کاربر جدید");

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "خطا در سرور: " + e.getMessage());
        }
        return response;
    }

    @PostMapping("/send-verification")
    public Map<String, Object> sendVerificationCode(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String mobile = standardizeMobile(request.get("mobile"));

            System.out.println("🔍 شماره دریافت شده: " + request.get("mobile"));
            System.out.println("🔍 شماره استاندارد شده: " + mobile);

            if (mobile == null || mobile.length() != 11 || !mobile.startsWith("09")) {
                response.put("success", false);
                response.put("message", "شماره موبایل معتبر نیست");
                return response;
            }

            // جستجوی کاربر
            Optional<User> userOpt = userRepository.findByMobile(mobile);
            System.out.println("🔍 کاربر پیدا شد: " + userOpt.isPresent());
            if (userOpt.isPresent()) {
                System.out.println("🔍 کاربر موجود - ID: " + userOpt.get().getId());
            }

            String verificationCode = "123456";
            System.out.println("📱 کد تایید: " + verificationCode);

            User user = userOpt.orElseGet(() -> {
                System.out.println("❌ کاربر جدید ایجاد میشه!");
                User newUser = new User();
                newUser.setMobile(mobile);
                newUser.setUsername(mobile);
                newUser.setRole("USER");
                newUser.setUserType("GUEST");
                return newUser;
            });

            user.setVerificationCode(verificationCode);
            User savedUser = userRepository.save(user);
            System.out.println("💾 کاربر ذخیره شد - ID: " + savedUser.getId());

            response.put("success", true);
            response.put("message", "کد تایید ارسال شد");

        } catch (Exception e) {
            System.out.println("💥 خطا: " + e.getMessage());
            response.put("success", false);
            response.put("message", "خطا در ارسال کد: " + e.getMessage());
        }
        return response;
    }

    @PostMapping("/verify-code")
    public Map<String, Object> verifyCode(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String mobile = standardizeMobile(request.get("mobile"));
            String code = request.get("code");

            if (mobile == null || code == null) {
                response.put("success", false);
                response.put("message", "شماره موبایل و کد تایید الزامی است");
                return response;
            }

            Optional<User> userOpt = userRepository.findByMobileAndVerificationCode(mobile, code);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                user.setVerificationCode(null);
                userRepository.save(user);

                Map<String, Object> userResponse = new HashMap<>();
                userResponse.put("id", user.getId());
                userResponse.put("mobile", user.getMobile());
                userResponse.put("role", user.getRole());
                userResponse.put("firstName", user.getFirstName());
                userResponse.put("lastName", user.getLastName());
                userResponse.put("profileImage", user.getProfileImage());
                userResponse.put("nationalCode", user.getNationalCode());
                userResponse.put("passportNumber", user.getPassportNumber());
                userResponse.put("address", user.getAddress());
                userResponse.put("userType", user.getUserType());

                response.put("success", true);
                response.put("token", "auth-token");
                response.put("user", userResponse);
                response.put("message", "ورود موفقیت‌آمیز");
            } else {
                response.put("success", false);
                response.put("message", "کد تایید نامعتبر است");
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "خطا در تایید کد: " + e.getMessage());
        }
        return response;
    }
}