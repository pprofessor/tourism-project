package com.tourism.app.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import jakarta.annotation.PostConstruct;
import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private static final Logger logger = LoggerFactory.getLogger(WebConfig.class);

    @Value("${app.media.upload-dir:D:/Project/Media}")
    private String mediaUploadDir;

    @PostConstruct
    public void init() {
        logger.info("🎯 WebConfig initialized");
        logger.info("📁 Media upload directory: {}", mediaUploadDir);

        File mediaDir = new File(mediaUploadDir);
        if (mediaDir.exists()) {
            logger.info("✅ Media directory exists: {}", mediaDir.getAbsolutePath());
        } else {
            logger.error("❌ Media directory does NOT exist: {}", mediaDir.getAbsolutePath());
        }
    }

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        logger.info("🔄 Configuring static resource handlers...");

        // ✅ راه حل قطعی: استفاده از مسیر مستقیم
        String mediaPath = "file:" + mediaUploadDir + "/";

        logger.info("📁 Registering media path: {}", mediaPath);

        // ✅ روش ۱: دسترسی مستقیم به تمام فایل‌ها
        registry.addResourceHandler("/media/**")
                .addResourceLocations(mediaPath)
                .setCachePeriod(3600);

        logger.info("✅ Media resources registered for: /media/** -> {}", mediaPath);

        // ✅ روش ۲: دسترسی به هر category جداگانه (برای compatibility)
        registry.addResourceHandler("/media/images/**")
                .addResourceLocations(mediaPath + "Images/")
                .setCachePeriod(3600);

        registry.addResourceHandler("/media/videos/**")
                .addResourceLocations(mediaPath + "Videos/")
                .setCachePeriod(3600);

        registry.addResourceHandler("/media/audios/**")
                .addResourceLocations(mediaPath + "Audios/")
                .setCachePeriod(3600);

        registry.addResourceHandler("/media/others/**")
                .addResourceLocations(mediaPath + "Others/")
                .setCachePeriod(3600);

        logger.info("🎉 All static resource handlers configured successfully");
    }
}