package com.tourism.app.controller;

import com.tourism.app.model.Payment;
import com.tourism.app.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    // دریافت تاریخچه پرداخت‌های کاربر
    @GetMapping("/user/{userId}")
    public Map<String, Object> getUserPayments(@PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Payment> payments = paymentRepository.findByUserIdOrderByCreatedAtDesc(userId);
            
            response.put("success", true);
            response.put("payments", payments);
            response.put("total", payments.size());
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "خطا در دریافت تاریخچه پرداخت‌ها");
        }
        
        return response;
    }

    // ایجاد پرداخت جدید
    @PostMapping("/create")
    public Map<String, Object> createPayment(@RequestBody Map<String, Object> paymentRequest) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            
            // فعلاً فقط در دیتابیس ذخیره می‌کنیم
            
            Payment payment = new Payment();
            payment.setUserId(Long.valueOf(paymentRequest.get("userId").toString()));
            payment.setAmount(new java.math.BigDecimal(paymentRequest.get("amount").toString()));
            payment.setDescription((String) paymentRequest.get("description"));
            payment.setServiceType((String) paymentRequest.get("serviceType"));
            payment.setServiceId(Long.valueOf(paymentRequest.get("serviceId").toString()));
            payment.setPaymentId("demo_" + System.currentTimeMillis());
            payment.setStatus("COMPLETED"); // برای تست موفق فرض می‌شود
            
            paymentRepository.save(payment);
            
            response.put("success", true);
            response.put("message", "پرداخت با موفقیت ثبت شد");
            response.put("paymentId", payment.getPaymentId());
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "خطا در ایجاد پرداخت");
        }
        
        return response;
    }
}