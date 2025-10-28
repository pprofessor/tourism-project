package com.tourism.app.Service;

import org.springframework.stereotype.Service;
import java.util.Random;

@Service
public class SmsService {

    // شبیه‌سازی ارسال پیامک - در محیط واقعی با سرویس‌دهنده پیامک интеграه می‌شود
    public String sendVerificationCode(String mobile) {
        String verificationCode = generateVerificationCode();
        
        // در محیط واقعی: اینجا کد ارسال به سرویس پیامک قرار می‌گیرد
        System.out.println("ارسال کد تایید " + verificationCode + " به شماره: " + mobile);
        
        return verificationCode;
    }
    
    private String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000); // کد 6 رقمی
        return String.valueOf(code);
    }
}