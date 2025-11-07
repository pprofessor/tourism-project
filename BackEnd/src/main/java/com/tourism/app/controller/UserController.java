package com.tourism.app.controller;

import com.tourism.app.model.User;
import com.tourism.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:4000"}) 
public class UserController {

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    @GetMapping("/users")
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @PostMapping("/users")
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    @PutMapping("/users/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
    user.setUsername(userDetails.getUsername());
    user.setEmail(userDetails.getEmail());
    user.setMobile(userDetails.getMobile());
    user.setRole(userDetails.getRole());
    user.setUserType(userDetails.getUserType());
    user.setFirstName(userDetails.getFirstName());
    user.setLastName(userDetails.getLastName());
    user.setNationalCode(userDetails.getNationalCode());
    user.setPassportNumber(userDetails.getPassportNumber());
    user.setAddress(userDetails.getAddress());
    user.setEmailVerified(userDetails.isEmailVerified());
        
        return userRepository.save(user);
    }

    @DeleteMapping("/users/{id}")
public Map<String, Object> deleteUser(@PathVariable Long id) {
    Map<String, Object> response = new HashMap<>();
    
    try {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        userRepository.delete(user);
        
        response.put("success", true);
        response.put("message", "کاربر با موفقیت حذف شد");
        
    } catch (Exception e) {
        response.put("success", false);
        response.put("message", "خطا در حذف کاربر: " + e.getMessage());
    }
    
    return response;
}



    // ایجاد کاربر ادمین - نسخه GET (برای تست آسان)
    @GetMapping("/users/create-admin-simple")
    public String createAdminSimple() {
        try {
            // بررسی وجود کاربر ادمین
            Optional<User> existingAdmin = userRepository.findByMobile("09123456789");
            
            if (existingAdmin.isPresent()) {
                // حذف کاربر قدیمی
                userRepository.delete(existingAdmin.get());
            }
            
            // ایجاد کاربر ادمین جدید با رمز encode شده
            User adminUser = new User();
            adminUser.setMobile("09123456789");
            adminUser.setUsername("admin");
            adminUser.setPassword(passwordEncoder.encode("admin123")); // رمز encode شده
            adminUser.setRole("ADMIN");
            adminUser.setUserType("ADMIN");
            adminUser.setEmail("admin@turino.com");
            
            userRepository.save(adminUser);
            
            return "کاربر ادمین ایجاد شد ✓ - موبایل: 09123456789 - رمز: admin123 (رمز encode شده)";
            
        } catch (Exception e) {
            return "خطا در ایجاد کاربر ادمین: " + e.getMessage();
        }
    }

// تغییر رمز عبور کاربر
@PostMapping("/users/{id}/change-password")
public Map<String, Object> changePassword(@PathVariable Long id, @RequestBody Map<String, String> request) {
    Map<String, Object> response = new HashMap<>();
    
    try {
        String newPassword = request.get("newPassword");
        
        if (newPassword == null || newPassword.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "رمز عبور جدید الزامی است");
            return response;
        }
        
        if (newPassword.length() < 6) {
            response.put("success", false);
            response.put("message", "رمز عبور باید حداقل ۶ کاراکتر باشد");
            return response;
        }
        
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // encode کردن رمز جدید
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        response.put("success", true);
        response.put("message", "رمز عبور با موفقیت تغییر کرد");
        
    } catch (Exception e) {
        response.put("success", false);
        response.put("message", "خطا در تغییر رمز عبور: " + e.getMessage());
    }
    
    return response;
}


    // ایجاد کاربر ادمین - نسخه POST
    @PostMapping("/users/create-admin")
    public Map<String, Object> createAdminUser() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // بررسی وجود کاربر ادمین
            Optional<User> existingAdmin = userRepository.findByMobile("09123456789");
            
            if (existingAdmin.isPresent()) {
                response.put("success", false);
                response.put("message", "کاربر ادمین از قبل وجود دارد");
                return response;
            }
            
            // ایجاد کاربر ادمین جدید
            User adminUser = new User();
            adminUser.setMobile("09123456789");
            adminUser.setUsername("admin");
            adminUser.setPassword("admin123");
            adminUser.setRole("ADMIN");
            adminUser.setUserType("ADMIN");
            adminUser.setEmail("admin@turino.com");
            
            userRepository.save(adminUser);
            
            response.put("success", true);
            response.put("message", "کاربر ادمین ایجاد شد");
            response.put("credentials", Map.of(
                "mobile", "09123456789",
                "password", "admin123"
            ));
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "خطا در ایجاد کاربر ادمین: " + e.getMessage());
        }
        
        return response;
    }
}