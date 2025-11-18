package com.tourism.app.controller;

import com.tourism.app.model.User;
import com.tourism.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.List;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private Random random = new Random();

    private String standardizeMobile(String mobile) {
        if (mobile == null)
            return null;

        String cleaned = mobile.replaceAll("[^0-9]", "");

        // حذف صفر ابتدایی
        if (cleaned.startsWith("0")) {
            cleaned = cleaned.substring(1);
        }

        return cleaned;
    }

    private String generateSimpleOTP() {
        // تولید کد ۶ رقمی با امکان اعداد تکراری
        return String.format("%06d", random.nextInt(1000000));
    }

    private Map<String, Object> createUserResponse(User user) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("mobile", user.getMobile());
        response.put("role", user.getRole());
        response.put("firstName", user.getFirstName());
        response.put("lastName", user.getLastName());
        response.put("profileImage", user.getProfileImage());
        response.put("nationalCode", user.getNationalCode());
        response.put("passportNumber", user.getPassportNumber());
        response.put("address", user.getAddress());
        response.put("userType", user.getUserType());
        return response;
    }

    @PostMapping("/init-login")
    public Map<String, Object> initLogin(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String mobile = standardizeMobile(request.get("mobile"));

            // شرط جدید برای شماره 10 رقمی بدون صفر
            if (mobile == null) {
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
            String originalMobile = request.get("mobile");
            String mobile = standardizeMobile(originalMobile);

            System.out.println("📱 شماره اصلی دریافت شده: '" + originalMobile + "'");
            System.out.println("📱 شماره استاندارد شده: '" + mobile + "'");

            if (mobile == null) {
                response.put("success", false);
                response.put("message", "شماره موبایل معتبر نیست");
                return response;
            }

            String verificationCode = generateSimpleOTP();
            System.out.println("🔢 کد OTP تولید شده: " + verificationCode);

            // جستجوی دقیق کاربر
            System.out.println("🔍 درحال جستجوی کاربر با شماره: '" + mobile + "'");
            Optional<User> userOpt = userRepository.findByMobile(mobile);
            System.out.println("🔍 نتیجه جستجو: " + userOpt.isPresent());

            if (userOpt.isPresent()) {
                User user = userOpt.get();
                System.out.println(
                        "✅ کاربر موجود پیدا شد - ID: " + user.getId() + ", Mobile: '" + user.getMobile() + "'");
            } else {
                System.out.println("❌ هیچ کاربری با شماره '" + mobile + "' پیدا نشد");

                // نمایش همه کاربران برای دیباگ
                System.out.println("📋 لیست تمام کاربران موجود در دیتابیس:");
                List<User> allUsers = userRepository.findAll();
                for (User u : allUsers) {
                    System.out.println("   👤 ID: " + u.getId() + ", Mobile: '" + u.getMobile() + "'");
                }
            }

            User user;
            if (userOpt.isPresent()) {
                user = userOpt.get();
                System.out.println("✅ استفاده از کاربر موجود - ID: " + user.getId());
            } else {
                user = new User();
                user.setMobile(mobile);
                user.setPhone(mobile);
                user.setUsername(mobile);
                user.setRole("USER");
                user.setUserType("GUEST");
                System.out.println("🆕 ایجاد کاربر جدید");
            }

            user.setVerificationCode(verificationCode);
            User savedUser = userRepository.save(user);
            System.out.println(
                    "💾 کاربر ذخیره شد - ID: " + savedUser.getId() + ", Mobile: '" + savedUser.getMobile() + "'");

            response.put("success", true);
            response.put("message", "کد تایید ارسال شد");

        } catch (Exception e) {
            System.out.println("💥 خطا در ارسال کد: " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "خطا در ارسال کد تایید");
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

                Map<String, Object> userResponse = createUserResponse(user);
                response.put("success", true);
                response.put("token", "auth-token-" + System.currentTimeMillis());
                response.put("user", userResponse);
                response.put("message", "ورود موفقیت‌آمیز");

                System.out.println("✅ کاربر لاگین کرد - ID: " + user.getId());
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

    @PostMapping("/login-password")
    public Map<String, Object> loginWithPassword(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String mobile = standardizeMobile(request.get("mobile"));
            String password = request.get("password");

            Optional<User> userOpt = userRepository.findByMobile(mobile);
            if (userOpt.isPresent()) {
                User user = userOpt.get();

                if (user.getPassword() != null && passwordEncoder.matches(password, user.getPassword())) {
                    Map<String, Object> userResponse = createUserResponse(user);
                    response.put("success", true);
                    response.put("token", "auth-token-" + System.currentTimeMillis());
                    response.put("user", userResponse);
                    response.put("message", "ورود موفقیت‌آمیز");
                } else {
                    response.put("success", false);
                    response.put("message", "رمز عبور نامعتبر است");
                }
            } else {
                response.put("success", false);
                response.put("message", "کاربری با این شماره یافت نشد");
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "خطا در ورود: " + e.getMessage());
        }
        return response;
    }

    @PostMapping("/complete-registration")
    public Map<String, Object> completeRegistration(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String mobile = standardizeMobile(request.get("mobile"));
            String username = request.get("username");
            String email = request.get("email");
            String password = request.get("password");

            Optional<User> userOpt = userRepository.findByMobile(mobile);
            if (userOpt.isPresent()) {
                User user = userOpt.get();

                if (username != null)
                    user.setUsername(username);
                if (email != null)
                    user.setEmail(email);
                if (password != null)
                    user.setPassword(passwordEncoder.encode(password));

                userRepository.save(user);
                response.put("success", true);
                response.put("message", "ثبت‌نام تکمیل شد");
            } else {
                response.put("success", false);
                response.put("message", "کاربر یافت نشد");
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "خطا در تکمیل ثبت‌نام: " + e.getMessage());
        }
        return response;
    }
}