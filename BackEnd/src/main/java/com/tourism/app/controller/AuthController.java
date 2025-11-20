package com.tourism.app.controller;

import com.tourism.app.config.JwtUtil;
import com.tourism.app.model.User;
import com.tourism.app.repository.UserRepository;
import com.tourism.app.service.RateLimitingService;
import com.tourism.app.service.RateLimitingService.Plan;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RateLimitingService rateLimitingService;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private Random random = new Random();

    private String standardizeMobile(String mobile) {
        if (mobile == null)
            return null;

        String cleaned = mobile.replaceAll("[^0-9]", "");

        // Remove leading zero
        if (cleaned.startsWith("0")) {
            cleaned = cleaned.substring(1);
        }

        return cleaned;
    }

    private String generateSimpleOTP() {
        // Generate 6-digit code with possible duplicate numbers
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
    public ResponseEntity<Map<String, Object>> initLogin(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String mobile = standardizeMobile(request.get("mobile"));

            if (mobile == null) {
                response.put("success", false);
                response.put("message", "شماره موبایل معتبر نیست");
                return ResponseEntity.badRequest().body(response);
            }

            Optional<User> userOpt = userRepository.findByMobile(mobile);
            boolean userExists = userOpt.isPresent();
            boolean hasPassword = false;

            if (userExists) {
                User user = userOpt.get();
                hasPassword = user.getPassword() != null; // بررسی وجود رمز عبور
            }

            logger.debug("User check - Mobile: {}, Exists: {}, HasPassword: {}", mobile, userExists, hasPassword);

            response.put("success", true);
            response.put("userExists", userExists);
            response.put("hasPassword", hasPassword); // اضافه کردن این خط
            response.put("message", userExists ? "کاربر موجود است" : "کاربر جدید");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error in initLogin for mobile {}: {}", request.get("mobile"), e.getMessage(), e);
            response.put("success", false);
            response.put("message", "خطا در سرور: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/send-verification")
    public ResponseEntity<Map<String, Object>> sendVerificationCode(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();

        String originalMobile = request.get("mobile");
        if (originalMobile == null) {
            response.put("success", false);
            response.put("message", "شماره موبایل الزامی است");
            return ResponseEntity.badRequest().body(response);
        }

        // اعمال Rate Limiting برای OTP
        if (!rateLimitingService.tryConsume(originalMobile, Plan.OTP)) {
            response.put("success", false);
            response.put("message", "تعداد درخواست‌های ارسال کد بیش از حد مجاز است. لطفاً ۱ دقیقه دیگر تلاش کنید.");
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(response);
        }

        try {
            String mobile = standardizeMobile(originalMobile);

            if (mobile == null) {
                response.put("success", false);
                response.put("message", "شماره موبایل معتبر نیست");
                return ResponseEntity.badRequest().body(response);
            }

            String verificationCode = generateSimpleOTP();
            logger.info("OTP code generated: {}", verificationCode);

            // Search for user
            Optional<User> userOpt = userRepository.findByMobile(mobile);

            User user;
            if (userOpt.isPresent()) {
                user = userOpt.get();
                logger.info("Existing user found - ID: {}, Mobile: '{}'", user.getId(), user.getMobile());
            } else {
                logger.info("No user found with mobile '{}' - creating new user", mobile);

                user = new User();
                user.setMobile(mobile);
                user.setPhone(mobile);
                user.setUsername(mobile);
                user.setRole("USER");
                user.setUserType("GUEST");
            }

            user.setVerificationCode(verificationCode);
            userRepository.save(user);

            response.put("success", true);
            response.put("message", "کد تایید ارسال شد");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error sending verification code for mobile {}: {}", originalMobile, e.getMessage(), e);
            response.put("success", false);
            response.put("message", "خطا در ارسال کد تایید");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/verify-code")
    public ResponseEntity<Map<String, Object>> verifyCode(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();

        String mobile = request.get("mobile");
        String code = request.get("code");

        if (mobile == null || code == null) {
            response.put("success", false);
            response.put("message", "شماره موبایل و کد تایید الزامی است");
            return ResponseEntity.badRequest().body(response);
        }

        // اعمال Rate Limiting برای verify
        if (!rateLimitingService.tryConsume(mobile, Plan.LOGIN)) {
            response.put("success", false);
            response.put("message", "تعداد درخواست‌های تأیید کد بیش از حد مجاز است. لطفاً ۱ دقیقه دیگر تلاش کنید.");
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(response);
        }

        try {
            String standardizedMobile = standardizeMobile(mobile);

            logger.info("🔍 Verifying code - Mobile: {}, Code: {}", standardizedMobile, code);
            logger.info("📊 Searching for user with mobile: {} and code: {}", standardizedMobile, code);

            if (standardizedMobile == null) {
                response.put("success", false);
                response.put("message", "شماره موبایل معتبر نیست");
                return ResponseEntity.badRequest().body(response);
            }

            Optional<User> userOpt = userRepository.findByMobileAndVerificationCode(standardizedMobile, code);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                user.setVerificationCode(null);
                userRepository.save(user);

                // تولید توکن JWT واقعی
                String token = jwtUtil.generateToken(user.getMobile());

                Map<String, Object> userResponse = createUserResponse(user);
                userResponse.put("hasPassword", user.getPassword() != null);
                response.put("success", true);
                response.put("token", token); // استفاده از توکن واقعی
                response.put("user", userResponse);
                response.put("message", "ورود موفقیت‌آمیز");

                return ResponseEntity.ok(response);
            } else {
                logger.warn("Invalid verification code - mobile: {}, code: {}", standardizedMobile, code);
                response.put("success", false);
                response.put("message", "کد تایید نامعتبر است");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            logger.error("Error verifying code for mobile {}: {}", mobile, e.getMessage(), e);
            response.put("success", false);
            response.put("message", "خطا در تایید کد: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/login-password")
    public ResponseEntity<Map<String, Object>> loginWithPassword(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();

        String mobile = request.get("mobile");
        String password = request.get("password");

        if (mobile == null || password == null) {
            response.put("success", false);
            response.put("message", "شماره موبایل و رمز عبور الزامی است");
            return ResponseEntity.badRequest().body(response);
        }

        // اعمال Rate Limiting برای login
        if (!rateLimitingService.tryConsume(mobile, Plan.LOGIN)) {
            response.put("success", false);
            response.put("message", "تعداد درخواست‌های ورود بیش از حد مجاز است. لطفاً ۱ دقیقه دیگر تلاش کنید.");
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(response);
        }

        try {
            String standardizedMobile = standardizeMobile(mobile);

            Optional<User> userOpt = userRepository.findByMobile(standardizedMobile);
            if (userOpt.isPresent()) {
                User user = userOpt.get();

                if (user.getPassword() != null && passwordEncoder.matches(password, user.getPassword())) {
                    // تولید توکن JWT واقعی
                    String token = jwtUtil.generateToken(user.getMobile());

                    Map<String, Object> userResponse = createUserResponse(user);
                    response.put("success", true);
                    response.put("token", token); // استفاده از توکن واقعی
                    response.put("user", userResponse);
                    response.put("message", "ورود موفقیت‌آمیز");

                    return ResponseEntity.ok(response);
                } else {
                    logger.warn("Invalid password for user: {}", standardizedMobile);
                    response.put("success", false);
                    response.put("message", "رمز عبور نامعتبر است");
                    return ResponseEntity.badRequest().body(response);
                }
            } else {
                response.put("success", false);
                response.put("message", "کاربری با این شماره یافت نشد");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            logger.error("Error in password login for mobile {}: {}", mobile, e.getMessage(), e);
            response.put("success", false);
            response.put("message", "خطا در ورود: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/set-initial-password")
    public ResponseEntity<Map<String, Object>> setInitialPassword(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();

        String mobile = request.get("mobile");
        String newPassword = request.get("newPassword");

        if (mobile == null || newPassword == null) {
            response.put("success", false);
            response.put("message", "شماره موبایل و رمز عبور جدید الزامی است");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            String standardizedMobile = standardizeMobile(mobile);

            Optional<User> userOpt = userRepository.findByMobile(standardizedMobile);
            if (userOpt.isPresent()) {
                User user = userOpt.get();

                // بررسی اینکه کاربر قبلاً رمز عبور دارد یا نه
                if (user.getPassword() != null) {
                    response.put("success", false);
                    response.put("message", "رمز عبور قبلاً تعریف شده است");
                    return ResponseEntity.badRequest().body(response);
                }

                // تنظیم رمز عبور جدید (hashing خودکار در setter انجام می‌شود)
                user.setPassword(newPassword);
                userRepository.save(user);

                response.put("success", true);
                response.put("message", "رمز عبور با موفقیت تعریف شد");

                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "کاربر یافت نشد");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            logger.error("Error setting initial password for mobile {}: {}", mobile, e.getMessage(), e);
            response.put("success", false);
            response.put("message", "خطا در تعریف رمز عبور: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/complete-registration")
    public ResponseEntity<Map<String, Object>> completeRegistration(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();

        String mobile = request.get("mobile");
        if (mobile == null) {
            response.put("success", false);
            response.put("message", "شماره موبایل الزامی است");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            String standardizedMobile = standardizeMobile(mobile);
            String username = request.get("username");
            String email = request.get("email");
            String password = request.get("password");

            Optional<User> userOpt = userRepository.findByMobile(standardizedMobile);
            if (userOpt.isPresent()) {
                User user = userOpt.get();

                if (username != null)
                    user.setUsername(username);
                if (email != null)
                    user.setEmail(email);
                if (password != null)
                    user.setPassword(password); // حالا hashing در setter انجام می‌شود

                userRepository.save(user);
                response.put("success", true);
                response.put("message", "ثبت‌نام تکمیل شد");
                return ResponseEntity.ok(response);
            } else {
                logger.warn("User not found for completing registration - Mobile: {}", standardizedMobile);
                response.put("success", false);
                response.put("message", "کاربر یافت نشد");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            logger.error("Error completing registration for mobile {}: {}", mobile, e.getMessage(), e);
            response.put("success", false);
            response.put("message", "خطا در تکمیل ثبت‌نام: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}