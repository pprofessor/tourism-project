package com.tourism.app.controller;

import com.tourism.app.Service.UserLevelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user-level")
@CrossOrigin(origins = "http://localhost:3000")
public class UserLevelController {

    @Autowired
    private UserLevelService userLevelService;

    // بررسی و ارتقاء سطح کاربر
    @PostMapping("/check-upgrade/{userId}")
    public Map<String, Object> checkAndUpgradeUserLevel(@PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            userLevelService.checkAndUpgradeUserLevel(userId);
            response.put("success", true);
            response.put("message", "سطح کاربر بررسی شد");
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "خطا در بررسی سطح کاربر");
        }
        
        return response;
    }

    // افزایش تعداد معرفی‌ها
    @PostMapping("/increment-referral/{userId}")
    public Map<String, Object> incrementReferralCount(@PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            userLevelService.incrementReferralCount(userId);
            response.put("success", true);
            response.put("message", "تعداد معرفی‌ها افزایش یافت");
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "خطا در افزایش تعداد معرفی‌ها");
        }
        
        return response;
    }
}