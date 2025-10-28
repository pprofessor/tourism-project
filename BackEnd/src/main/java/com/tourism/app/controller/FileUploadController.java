package com.tourism.app.controller;

import com.tourism.app.model.User;
import com.tourism.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "http://localhost:3000")
public class FileUploadController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/profile-image")
    public Map<String, Object> uploadProfileImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("userId") Long userId) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (file.isEmpty()) {
                response.put("success", false);
                response.put("message", "فایل خالی است");
                return response;
            }
            
            // ایجاد پوشه uploads/profiles
            Path uploadsDir = Paths.get("uploads/profiles");
            Files.createDirectories(uploadsDir);
            
            // تولید نام فایل منحصر به فرد
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path destination = uploadsDir.resolve(fileName);
            
            // ذخیره فایل
            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
            
            // آدرس فایل برای دسترسی از فرانت‌اند
            String fileUrl = "/uploads/profiles/" + fileName;

            // آپدیت کاربر در دیتابیس
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                user.setProfileImage(fileUrl);
                userRepository.save(user);
                
                response.put("success", true);
                response.put("message", "عکس پروفایل با موفقیت آپلود شد");
                response.put("imageUrl", fileUrl);
            } else {
                response.put("success", false);
                response.put("message", "کاربر یافت نشد");
            }

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "خطا در آپلود فایل: " + e.getMessage());
        }
        
        return response;
    }

    // متد قدیمی برای سازگاری
    @PostMapping("/upload")
    public String handleFileUpload(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return "Error: File is empty";
            }
            
            Path uploadsDir = Paths.get("uploads");
            Files.createDirectories(uploadsDir);
            
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path destination = uploadsDir.resolve(fileName);
            
            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
            
            return fileName;
            
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }
}