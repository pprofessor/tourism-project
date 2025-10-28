package com.tourism.app.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/media")
@CrossOrigin(origins = "*")
public class MediaController {

    private String getUploadDir() {
        try {
            // راه ساده‌تر: مستقیماً مسیر ریشه پروژه رو مشخص کن
            String projectRoot = "D:/Project";  // مسیر کامل پروژه
            String uploadDir = projectRoot + "/Media";
            
            System.out.println("📍 مسیر آپلود: " + uploadDir);
            
            // بررسی وجود پوشه
            File dir = new File(uploadDir);
            System.out.println("📁 مسیر وجود دارد: " + dir.exists());
            if (dir.exists()) {
                String[] files = dir.list();
                System.out.println("📂 محتویات پوشه: " + (files != null ? Arrays.toString(files) : "خالی"));
            }
            
            return uploadDir;
        } catch (Exception e) {
            System.out.println("❌ خطا در پیدا کردن مسیر: " + e.getMessage());
            return "D:/Project/Media"; // fallback
        }
    }

   @PostMapping("/upload")
public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
    try {
        // بررسی فایل
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("فایل خالی است");
        }

        String uploadDir = getUploadDir();
        
        // تشخیص نوع فایل و پوشه مربوطه
        String fileType = getFileCategory(file);
        String categoryFolder = getCategoryFolder(fileType);
        String categoryPath = uploadDir + "/" + categoryFolder;
        
        // ایجاد پوشه دسته‌بندی اگر وجود ندارد
        File categoryDirectory = new File(categoryPath);
        if (!categoryDirectory.exists()) {
            categoryDirectory.mkdirs();
        }

        // تولید نام منحصر به فرد برای فایل
        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null || originalFileName.trim().isEmpty()) {
            originalFileName = "unknown_file";
        }
        
        String safeFileName = originalFileName
                .replaceAll("\\s+", "_")
                .replaceAll("[^a-zA-Z0-9._-]", "");
        
        String fileName = System.currentTimeMillis() + "_" + safeFileName;
        Path filePath = Paths.get(categoryPath, fileName);

        // ذخیره فایل
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // ایجاد response
        Map<String, String> response = new HashMap<>();
        response.put("fileName", fileName);
        response.put("fileUrl", "/media/" + categoryFolder + "/" + fileName);
        response.put("fileType", file.getContentType());
        response.put("size", String.valueOf(file.getSize()));
        response.put("category", fileType);
        response.put("categoryFolder", categoryFolder);

        System.out.println("✅ فایل آپلود شد: " + fileName + " در دسته: " + fileType);
        return ResponseEntity.ok(response);

    } catch (Exception e) {
        System.out.println("❌ خطا در آپلود فایل: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("خطا در آپلود فایل: " + e.getMessage());
    }
}

// تابع برای تشخیص دسته فایل
private String getFileCategory(MultipartFile file) {
    String contentType = file.getContentType();
    String fileName = file.getOriginalFilename();
    
    if (contentType != null) {
        if (contentType.startsWith("image/")) return "image";
        if (contentType.startsWith("video/")) return "video";
        if (contentType.startsWith("audio/")) return "audio";
    }
    
    if (fileName != null) {
        String extension = fileName.toLowerCase();
        if (extension.endsWith(".jpg") || extension.endsWith(".jpeg") || 
            extension.endsWith(".png") || extension.endsWith(".gif") || 
            extension.endsWith(".webp") || extension.endsWith(".bmp")) {
            return "image";
        }
        if (extension.endsWith(".mp4") || extension.endsWith(".avi") || 
            extension.endsWith(".mov") || extension.endsWith(".wmv") || 
            extension.endsWith(".mkv")) {
            return "video";
        }
        if (extension.endsWith(".mp3") || extension.endsWith(".wav") || 
            extension.endsWith(".ogg") || extension.endsWith(".aac")) {
            return "audio";
        }
    }
    
    return "other";
}

// تابع برای نام پوشه دسته‌بندی
private String getCategoryFolder(String fileType) {
    switch (fileType) {
        case "image": return "Images";
        case "video": return "Videos";
        case "audio": return "Audios";
        default: return "Others";
    }
}
    @GetMapping("/files")
public ResponseEntity<List<Map<String, String>>> getFiles() {
    try {
        List<Map<String, String>> files = new ArrayList<>();
        String uploadDir = getUploadDir();
        
        // پوشه‌های دسته‌بندی
        String[] categories = {"Images", "Videos", "Audios", "Others"};
        
        for (String category : categories) {
            File categoryDir = new File(uploadDir + "/" + category);
            if (categoryDir.exists() && categoryDir.isDirectory()) {
                File[] fileList = categoryDir.listFiles();
                if (fileList != null) {
                    for (File file : fileList) {
                        if (file.isFile()) {
                            System.out.println("✅ پیدا شد: " + file.getName());
                            Map<String, String> fileInfo = new HashMap<>();
                            fileInfo.put("name", file.getName());
                            fileInfo.put("url", "/media/" + file.getName());
                            fileInfo.put("size", String.valueOf(file.length()));
                            fileInfo.put("uploadedAt", new Date(file.lastModified()).toString());
                            files.add(fileInfo);
                        }
                    }
                }
            } else {
                System.out.println("❌ مسیر وجود ندارد یا دایرکتوری نیست");
            }
            
            System.out.println("📨 ارسال " + files.size() + " فایل به فرانت‌اند");
            return ResponseEntity.ok(files);
        } catch (Exception e) {
            System.out.println("❌ خطا در getFiles: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ArrayList<>());
        }
    }

    @DeleteMapping("/delete/{fileName}")
    public ResponseEntity<?> deleteFile(@PathVariable String fileName) {
        try {
            String uploadDir = getUploadDir();
            Path filePath = Paths.get(uploadDir, fileName);
            Files.deleteIfExists(filePath);
            return ResponseEntity.ok("فایل با موفقیت حذف شد");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("خطا در حذف فایل");
        }
    }
}