package com.tourism.app.controller;

import com.tourism.app.model.User;
import com.tourism.app.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserRepository userRepository;

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
    public Map<String, Object> initLogin(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String mobile = standardizeMobile(request.get("mobile"));

            // Check for valid 10-digit number without zero
            if (mobile == null) {
                response.put("success", false);
                response.put("message", "شماره موبایل معتبر نیست");
                return response;
            }

            boolean userExists = userRepository.findByMobile(mobile).isPresent();

            logger.debug("User existence check - Mobile: {}, Exists: {}", mobile, userExists);

            response.put("success", true);
            response.put("userExists", userExists);
            response.put("message", userExists ? "کاربر موجود است" : "کاربر جدید");

        } catch (Exception e) {
            logger.error("Error in initLogin for mobile {}: {}", request.get("mobile"), e.getMessage(), e);
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

            logger.info("Original mobile received: '{}'", originalMobile);
            logger.info("Standardized mobile: '{}'", mobile);

            if (mobile == null) {
                logger.warn("Invalid mobile number: {}", originalMobile);
                response.put("success", false);
                response.put("message", "شماره موبایل معتبر نیست");
                return response;
            }

            String verificationCode = generateSimpleOTP();
            logger.info("OTP code generated: {}", verificationCode);

            // Search for user
            logger.info("Searching for user with mobile: '{}'", mobile);
            Optional<User> userOpt = userRepository.findByMobile(mobile);
            logger.info("Search result: {}", userOpt.isPresent());

            User user;
            if (userOpt.isPresent()) {
                user = userOpt.get();
                logger.info("Existing user found - ID: {}, Mobile: '{}'", user.getId(), user.getMobile());
            } else {
                logger.info("No user found with mobile '{}' - creating new user", mobile);

                // Debug: List all users (only in debug mode)
                if (logger.isDebugEnabled()) {
                    List<User> allUsers = userRepository.findAll();
                    logger.debug("All users in database:");
                    for (User u : allUsers) {
                        logger.debug("User - ID: {}, Mobile: '{}'", u.getId(), u.getMobile());
                    }
                }

                user = new User();
                user.setMobile(mobile);
                user.setPhone(mobile);
                user.setUsername(mobile);
                user.setRole("USER");
                user.setUserType("GUEST");
                logger.info("New user created for mobile: {}", mobile);
            }

            user.setVerificationCode(verificationCode);
            User savedUser = userRepository.save(user);
            logger.info("User saved - ID: {}, Mobile: '{}'", savedUser.getId(), savedUser.getMobile());

            response.put("success", true);
            response.put("message", "کد تایید ارسال شد");

        } catch (Exception e) {
            logger.error("Error sending verification code for mobile {}: {}", request.get("mobile"), e.getMessage(), e);
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
                logger.warn("Incomplete data for verify-code - mobile: {}, code: {}", mobile, code);
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

                logger.info("User logged in successfully - ID: {}, Mobile: {}", user.getId(), user.getMobile());
            } else {
                logger.warn("Invalid verification code - mobile: {}, code: {}", mobile, code);
                response.put("success", false);
                response.put("message", "کد تایید نامعتبر است");
            }
        } catch (Exception e) {
            logger.error("Error verifying code for mobile {}: {}", request.get("mobile"), e.getMessage(), e);
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

                    logger.info("Password login successful - ID: {}, Mobile: {}", user.getId(), user.getMobile());
                } else {
                    logger.warn("Invalid password for user: {}", mobile);
                    response.put("success", false);
                    response.put("message", "رمز عبور نامعتبر است");
                }
            } else {
                logger.warn("User not found with mobile: {}", mobile);
                response.put("success", false);
                response.put("message", "کاربری با این شماره یافت نشد");
            }
        } catch (Exception e) {
            logger.error("Error in password login for mobile {}: {}", request.get("mobile"), e.getMessage(), e);
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
                logger.info("Registration completed - Mobile: {}, Username: {}", mobile, username);
                response.put("success", true);
                response.put("message", "ثبت‌نام تکمیل شد");
            } else {
                logger.warn("User not found for completing registration - Mobile: {}", mobile);
                response.put("success", false);
                response.put("message", "کاربر یافت نشد");
            }
        } catch (Exception e) {
            logger.error("Error completing registration for mobile {}: {}", request.get("mobile"), e.getMessage(), e);
            response.put("success", false);
            response.put("message", "خطا در تکمیل ثبت‌نام: " + e.getMessage());
        }
        return response;
    }
}