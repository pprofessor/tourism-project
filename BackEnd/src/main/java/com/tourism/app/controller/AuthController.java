package com.tourism.app.controller;

import com.tourism.app.model.User;
import com.tourism.app.repository.UserRepository;
import com.tourism.app.Service.SmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import com.tourism.app.Service.UserLevelService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SmsService smsService;

    @Autowired
    private UserLevelService userLevelService;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // مرحله 1: دریافت شماره موبایل و بررسی وجود کاربر
    @PostMapping("/init-login")
    public Map<String, Object> initLogin(@RequestBody Map<String, String> request) {
        String mobile = request.get("mobile");

        Map<String, Object> response = new HashMap<>();

        if (mobile == null || mobile.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "شماره موبایل الزامی است");
            return response;
        }

        // پاکسازی شماره موبایل
        mobile = mobile.replaceAll("[^0-9]", "");

        if (mobile.length() == 10 && mobile.startsWith("9")) {
            // شماره 10 رقمی بدون صفر - اضافه کردن صفر
            mobile = "0" + mobile;
        } else if (mobile.length() != 11 || !mobile.startsWith("09")) {
            response.put("success", false);
            response.put("message", "شماره موبایل معتبر نیست");
            return response;
        }

        // بررسی وجود کاربر در دیتابیس
        Optional<User> existingUser = userRepository.findByMobile(mobile);

        if (existingUser.isPresent()) {
            // کاربر موجود است
            response.put("success", true);
            response.put("userExists", true);
            response.put("message", "کاربر با این شماره موجود است");
        } else {
            // کاربر جدید
            response.put("success", true);
            response.put("userExists", false);
            response.put("message", "شماره موبایل جدید است");
        }

        return response;
    }

    // مرحله 2: ارسال کد تایید
    @PostMapping("/send-verification")
    public Map<String, Object> sendVerificationCode(@RequestBody Map<String, String> request) {
        String mobile = request.get("mobile");

        Map<String, Object> response = new HashMap<>();

        if (mobile == null || mobile.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "شماره موبایل الزامی است");
            return response;
        }

        mobile = mobile.replaceAll("[^0-9]", "");

        try {
            String verificationCode = smsService.sendVerificationCode(mobile);

            // ذخیره کد در دیتابیس (برای کاربر موجود یا جدید)
            Optional<User> userOpt = userRepository.findByMobile(mobile);
            User user;

            if (userOpt.isPresent()) {
                user = userOpt.get();
            } else {
                // ایجاد کاربر جدید موقت
                user = new User();
                user.setMobile(mobile);
                user.setUsername(mobile); // موقتاً username = mobile
                user.setRole("USER");
                user.setUserType("REGISTERED_TOURIST");
            }

            user.setVerificationCode(verificationCode);
            userRepository.save(user);

            response.put("success", true);
            response.put("message", "کد تایید ارسال شد");

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "خطا در ارسال کد تایید");
        }

        return response;
    }

    // مرحله 3: ورود با کد تایید
    @PostMapping("/verify-code")
    public Map<String, Object> verifyCode(@RequestBody Map<String, String> request) {
        String mobile = request.get("mobile");
        String code = request.get("code");

        Map<String, Object> response = new HashMap<>();

        if (mobile == null || code == null) {
            response.put("success", false);
            response.put("message", "شماره موبایل و کد تایید الزامی است");
            return response;
        }

        mobile = mobile.replaceAll("[^0-9]", "");

        Optional<User> userOpt = userRepository.findByMobileAndVerificationCode(mobile, code);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            // پاک کردن کد تایید بعد از استفاده
            user.setVerificationCode(null);
            userRepository.save(user);

            // تولید توکن (در محیط واقعی JWT استفاده شود)
            String token = "auth-token-" + System.currentTimeMillis();

            response.put("success", true);
            response.put("token", token);
            response.put("user", Map.of(
                    "id", user.getId(),
                    "mobile", user.getMobile(),
                    "role", user.getRole()));
            response.put("message", "ورود موفقیت‌آمیز");

        } else {
            response.put("success", false);
            response.put("message", "کد تایید نامعتبر است");
        }

        return response;
    }

    // مرحله 4: ورود با رمز عبور (برای کاربران موجود)
    @PostMapping("/login-password")
    public Map<String, Object> loginWithPassword(@RequestBody Map<String, String> request) {
        String mobile = request.get("mobile");
        String password = request.get("password");

        Map<String, Object> response = new HashMap<>();

        Optional<User> userOpt = userRepository.findByMobile(mobile);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            if (user.getPassword() != null && passwordEncoder.matches(password, user.getPassword())) {
                // تولید توکن
                String token = "auth-token-" + System.currentTimeMillis();

                response.put("success", true);
                response.put("token", token);
                response.put("user", Map.of(
                        "id", user.getId(),
                        "mobile", user.getMobile(),
                        "role", user.getRole()));
                response.put("message", "ورود موفقیت‌آمیز");
            } else {
                response.put("success", false);
                response.put("message", "رمز عبور نامعتبر است");
            }
        } else {
            response.put("success", false);
            response.put("message", "کاربری با این شماره یافت نشد");
        }

        return response;
    }

    // ثبت‌نام کامل کاربر (بعد از ورود با کد تایید)
    @PostMapping("/complete-registration")
    public Map<String, Object> completeRegistration(@RequestBody Map<String, String> request) {
        String mobile = request.get("mobile");
        String username = request.get("username");
        String email = request.get("email");
        String password = request.get("password");

        Map<String, Object> response = new HashMap<>();

        Optional<User> userOpt = userRepository.findByMobile(mobile);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            // تکمیل اطلاعات کاربر
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

        return response;
    }

}