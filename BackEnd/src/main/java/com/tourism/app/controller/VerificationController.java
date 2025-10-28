package com.tourism.app.controller;

import com.tourism.app.model.User;
import com.tourism.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/verification")
public class VerificationController {

    @Autowired
    private UserRepository userRepository;

    // ارسال کد تأیید به ایمیل
    @PostMapping("/send-email-code")
    public Map<String, String> sendEmailVerificationCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        Map<String, String> response = new HashMap<>();

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            response.put("error", "User not found");
            return response;
        }

        // تولید کد ۶ رقمی
        String verificationCode = generateVerificationCode();
        
        //در آینده اینجا ایمیل واقعی ارسال میشه
        System.out.println("Verification code for " + email + ": " + verificationCode);
        
        // ذخیره کد در کاربر (در حالت واقعی باید در جدول جداگانه ذخیره بشه)
        User user = userOpt.get();
        user.setVerificationCode(verificationCode);
        userRepository.save(user);

        response.put("message", "Verification code sent to email");
        response.put("code", verificationCode); // فقط برای تست
        return response;
    }

    // تأیید کد ایمیل
    @PostMapping("/verify-email")
    public Map<String, String> verifyEmailCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = request.get("code");
        Map<String, String> response = new HashMap<>();

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            response.put("error", "User not found");
            return response;
        }

        User user = userOpt.get();
        
        if (code.equals(user.getVerificationCode())) {
            user.setEmailVerified(true);
            user.setUserType("VERIFIED_TOURIST"); // ارتقا به کاربر تأییدشده
            user.setVerificationCode(null); // پاک کردن کد
            userRepository.save(user);
            
            response.put("message", "Email verified successfully");
            response.put("userType", user.getUserType());
        } else {
            response.put("error", "Invalid verification code");
        }

        return response;
    }

    // ارتقا کاربر به سفیر
    @PostMapping("/upgrade-to-ambassador")
    public Map<String, String> upgradeToAmbassador(@RequestBody Map<String, String> request) {
        String userId = request.get("userId");
        Map<String, String> response = new HashMap<>();

        Optional<User> userOpt = userRepository.findById(Long.parseLong(userId));
        if (userOpt.isEmpty()) {
            response.put("error", "User not found");
            return response;
        }

        User user = userOpt.get();
        
        // شرایط ارتقا به سفیر
        if (!user.isEmailVerified()) {
            response.put("error", "Email must be verified");
            return response;
        }

        user.setUserType("AMBASSADOR");
        user.setAmbassadorCode(generateAmbassadorCode(user.getUsername()));
        userRepository.save(user);

        response.put("message", "Upgraded to ambassador successfully");
        response.put("ambassadorCode", user.getAmbassadorCode());
        return response;
    }

    private String generateVerificationCode() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(999999));
    }

    private String generateAmbassadorCode(String username) {
        return "AMB_" + username.toUpperCase() + "_" + System.currentTimeMillis();
    }
}