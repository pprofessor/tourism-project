package com.tourism.app.controller;

import com.tourism.app.config.MediaProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.util.List;
import java.util.ArrayList;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.text.SimpleDateFormat;

@RestController
@RequestMapping("/api/media")
@CrossOrigin(origins = "*")
public class MediaController {

    private static final Logger logger = LoggerFactory.getLogger(MediaController.class);

    private final MediaProperties mediaProperties;

    @Value("${server.port:8080}")
    private String serverPort;

    // Constructor injection
    public MediaController(MediaProperties mediaProperties) {
        this.mediaProperties = mediaProperties;
    }

    @PostConstruct
    public void init() {
        try {
            
            File mainDir = new File(mediaProperties.getUploadDir());
            if (!mainDir.exists()) {
                boolean created = mainDir.mkdirs();
                if (created) {
                    logger.info("[SUCCESS] Created main upload directory: {}", mediaProperties.getUploadDir());
                } else {
                    logger.error("[ERROR] Failed to create upload directory: {}", mediaProperties.getUploadDir());
                }
            }
            
            String[] categories = {"Images", "Videos", "Audios", "Others"};
            for (String category : categories) {
                File categoryDir = new File(mediaProperties.getUploadDir() + "/" + category);
                if (!categoryDir.exists()) {
                    boolean created = categoryDir.mkdirs();
                    if (created) {
                        logger.debug("[CREATE] Created category directory: {}", categoryDir.getAbsolutePath());
                    }
                }
            }
            
            
        } catch (Exception e) {
            logger.error("[ERROR] Error initializing media controller: {}", e.getMessage());
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
      
        try {
            if (file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("success", false, "message", "File is empty"));
            }

            // بررسی حجم فایل (50MB)
            if (file.getSize() > 50 * 1024 * 1024) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("success", false, "message", "File size exceeds 50MB limit"));
            }

            String fileType = getFileCategory(file);
            String categoryFolder = getCategoryFolder(fileType);
            String categoryPath = mediaProperties.getUploadDir() + "/" + categoryFolder;
            
            File categoryDirectory = new File(categoryPath);
            if (!categoryDirectory.exists()) {
                boolean created = categoryDirectory.mkdirs();
                if (!created) {
                    logger.error("[ERROR] Failed to create category directory: {}", categoryPath);
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body(Map.of("success", false, "message", "Failed to create directory"));
                }
            }

            String originalFileName = file.getOriginalFilename();
            if (originalFileName == null || originalFileName.trim().isEmpty()) {
                originalFileName = "unknown_file";
            }
            
            // پاکسازی نام فایل
            String safeFileName = originalFileName
                    .replaceAll("\\s+", "_")
                    .replaceAll("[^a-zA-Z0-9._-]", "");
            
            String fileName = System.currentTimeMillis() + "_" + safeFileName;
            Path filePath = Paths.get(categoryPath, fileName);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            logger.info("[SUCCESS] File uploaded successfully: {} (Type: {}, Size: {} bytes)", 
                       fileName, fileType, file.getSize());

            // ساخت URL کامل برای دسترسی از فرانت‌اند
            String fileUrl = String.format("http://localhost:%s/media/%s/%s", serverPort, categoryFolder, fileName);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("fileName", fileName);
            response.put("fileUrl", fileUrl);
            response.put("fileType", file.getContentType());
            response.put("size", file.getSize());
            response.put("category", fileType);
            response.put("categoryFolder", categoryFolder);
            response.put("uploadedAt", new Date().toString());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("[ERROR] File upload error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "File upload error: " + e.getMessage()));
        }
    }

   @GetMapping("/files")
public ResponseEntity<?> getFiles() {   
    try {
        List<Map<String, Object>> files = new ArrayList<>();
        String[] categories = {"Images", "Videos", "Audios", "Others"};
        int totalFiles = 0;
        
        for (String category : categories) {
            File categoryDir = new File(mediaProperties.getUploadDir() + "/" + category);
            if (categoryDir.exists() && categoryDir.isDirectory()) {
                File[] fileList = categoryDir.listFiles();
                if (fileList != null) {
                    for (File file : fileList) {
                        if (file.isFile()) {
                            Map<String, Object> fileInfo = new HashMap<>();
                            fileInfo.put("id", file.getName());
                            fileInfo.put("name", file.getName());
                            
                            // ✅ این خط رو اصلاح کن - استفاده از مسیر درست
                            fileInfo.put("url", String.format("http://localhost:%s/media/images/%s", serverPort, file.getName()));
                            
                            fileInfo.put("size", file.length());
                            fileInfo.put("uploadedAt", formatFileDate(file));
                            fileInfo.put("category", category.toLowerCase());
                            fileInfo.put("type", getFileTypeFromExtension(file.getName()));
                            
                            files.add(fileInfo);
                            totalFiles++;
                            logger.debug("[FOUND] File: {} in {}", file.getName(), category);
                        }
                    }
                }
            }
        }
               
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", files);
        response.put("total", totalFiles);
        
        return ResponseEntity.ok(response);
        
    } catch (Exception e) {
        logger.error("[ERROR] Error getting files list: {}", e.getMessage(), e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error getting files list: " + e.getMessage()));
    }
}

    @PutMapping("/rename/{fileName}")
public ResponseEntity<?> renameFile(@PathVariable String fileName, @RequestBody Map<String, String> request) {
    
    try {
        String newFileName = request.get("newFileName");
        if (newFileName == null || newFileName.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", "New file name is required"));
        }

        // پاکسازی نام جدید فایل
        String safeNewFileName = newFileName
                .replaceAll("\\s+", "_")
                .replaceAll("[^a-zA-Z0-9._-]", "");

        String[] categories = {"Images", "Videos", "Audios", "Others"};
        boolean renamed = false;
        String fileCategory = "";
        String oldFileName = "";

        // پیدا کردن فایل در پوشه‌ها
        for (String category : categories) {
            Path oldPath = Paths.get(mediaProperties.getUploadDir() + "/" + category, fileName);
            if (Files.exists(oldPath)) {
                Path newPath = Paths.get(mediaProperties.getUploadDir() + "/" + category, safeNewFileName);
                Files.move(oldPath, newPath, StandardCopyOption.REPLACE_EXISTING);
                renamed = true;
                fileCategory = category;
                oldFileName = fileName;
                break;
            }
        }

        if (renamed) {
            // ✅ ساخت URL جدید برای فایل rename شده
            String newFileUrl = String.format("http://localhost:%s/media/%s/%s", serverPort, fileCategory, safeNewFileName);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "File renamed successfully");
            response.put("oldName", oldFileName);
            response.put("newName", safeNewFileName);
            response.put("newUrl", newFileUrl); // ✅ این خط مهمه
            return ResponseEntity.ok(response);
        } else {
            logger.warn("[WARNING] File not found for rename: {}", fileName);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "File not found"));
        }
        
    } catch (Exception e) {
        logger.error("[ERROR] Error renaming file: {}", e.getMessage(), e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error renaming file: " + e.getMessage()));
    }
}

    @DeleteMapping("/delete/{fileName}")
    public ResponseEntity<?> deleteFile(@PathVariable String fileName) {
        
        try {
            String[] categories = {"Images", "Videos", "Audios", "Others"};
            boolean deleted = false;
            
            for (String category : categories) {
                Path filePath = Paths.get(mediaProperties.getUploadDir() + "/" + category, fileName);
                if (Files.exists(filePath)) {
                    Files.delete(filePath);
                    deleted = true;
                    logger.info("[SUCCESS] File deleted successfully: {} from {}", fileName, category);
                    break;
                }
            }
            
            if (deleted) {
                return ResponseEntity.ok(Map.of("success", true, "message", "File deleted successfully"));
            } else {
                logger.warn("[WARNING] File not found for deletion: {}", fileName);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("success", false, "message", "File not found"));
            }
            
        } catch (Exception e) {
            logger.error("[ERROR] Error deleting file: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "Error deleting file: " + e.getMessage()));
        }
    }

    private String getFileCategory(MultipartFile file) {
        String contentType = file.getContentType();
        String fileName = file.getOriginalFilename();
        
        if (contentType != null) {
            if (contentType.startsWith("image/")) return "image";
            if (contentType.startsWith("video/")) return "video";
            if (contentType.startsWith("audio/")) return "audio";
        }
        
        return getFileTypeFromExtension(fileName);
    }

    private String getFileTypeFromExtension(String fileName) {
        if (fileName == null) return "other";
        
        String extension = fileName.toLowerCase();
        if (extension.endsWith(".jpg") || extension.endsWith(".jpeg") || 
            extension.endsWith(".png") || extension.endsWith(".gif") || 
            extension.endsWith(".webp") || extension.endsWith(".bmp") ||
            extension.endsWith(".svg")) {
            return "image";
        }
        if (extension.endsWith(".mp4") || extension.endsWith(".avi") || 
            extension.endsWith(".mov") || extension.endsWith(".wmv") || 
            extension.endsWith(".mkv") || extension.endsWith(".flv") ||
            extension.endsWith(".webm")) {
            return "video";
        }
        if (extension.endsWith(".mp3") || extension.endsWith(".wav") || 
            extension.endsWith(".ogg") || extension.endsWith(".aac") ||
            extension.endsWith(".flac") || extension.endsWith(".m4a")) {
            return "audio";
        }
        
        return "other";
    }

    private String getCategoryFolder(String fileType) {
        switch (fileType) {
            case "image": return "Images";
            case "video": return "Videos";
            case "audio": return "Audios";
            default: return "Others";
        }
    }

    private String formatFileDate(File file) {
    try {
        // استفاده از lastModified برای تاریخ فایل
        long lastModified = file.lastModified();
        if (lastModified > 0) {
            Date date = new Date(lastModified);
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            return sdf.format(date);
        }
    } catch (Exception e) {
        logger.warn("[WARNING] Error formatting date for file: {}", file.getName());
    }
    return new Date().toString(); // تاریخ فعلی به عنوان fallback
}
}