package com.tourism.app.service;

import com.tourism.app.model.User;
import com.tourism.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserLevelService {

    @Autowired
    private UserRepository userRepository;

    // بررسی و ارتقاء سطح کاربر
    public void checkAndUpgradeUserLevel(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return;

        String currentLevel = user.getUserType();
        String newLevel = calculateUserLevel(user);

        if (!currentLevel.equals(newLevel)) {
            user.setUserType(newLevel);
            userRepository.save(user);
        }
    }

    // محاسبه سطح کاربر بر اساس معیارها
    private String calculateUserLevel(User user) {
        boolean hasCompleteProfile = hasCompleteProfile(user);
        boolean hasVerifiedEmail = user.isEmailVerified();
        int referralCount = user.getReferredCount() != null ? user.getReferredCount() : 0;

        // شرایط سطح‌بندی
        if (referralCount >= 10) {
            return "AMBASSADOR"; // سفیر - ۱۰ کاربر معرفی شده
        } else if (hasCompleteProfile && hasVerifiedEmail) {
            return "VERIFIED"; // کاربر احراز هویت شده
        } else {
            return "GUEST"; // کاربر مهمان
        }
    }

    // بررسی تکمیل بودن پروفایل
    private boolean hasCompleteProfile(User user) {
        return user.getFirstName() != null && !user.getFirstName().trim().isEmpty() &&
               user.getLastName() != null && !user.getLastName().trim().isEmpty() &&
               user.getNationalCode() != null && !user.getNationalCode().trim().isEmpty() &&
               user.getAddress() != null && !user.getAddress().trim().isEmpty();
    }

    // افزایش تعداد کاربران معرفی شده
    public void incrementReferralCount(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            int currentCount = user.getReferredCount() != null ? user.getReferredCount() : 0;
            user.setReferredCount(currentCount + 1);
            userRepository.save(user);
            
            // بررسی ارتقاء سطح
            checkAndUpgradeUserLevel(userId);
        }
    }
}