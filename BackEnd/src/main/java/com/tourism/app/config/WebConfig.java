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

    @Value("${app.media.upload-dir:./uploads}")
    private String mediaUploadDir;

    @Value("${app.cors.allowed-origins:http://localhost:3000,http://localhost:4000}")
    private String corsAllowedOrigins;

    @PostConstruct
    public void init() {
        logger.info("🎯 WebConfig initialized");
        logger.info("📁 Media upload directory: {}", mediaUploadDir);
        System.out.println("✅ Tourism Application started successfully on port 8080!");
        System.out.println("📁 Media upload directory: " + mediaUploadDir);
        System.out.println("🌐 CORS allowed origins: " + corsAllowedOrigins);

        File mediaDir = new File(mediaUploadDir);
        if (mediaDir.exists()) {
            logger.info("✅ Media directory exists: {}", mediaDir.getAbsolutePath());
        } else {
            logger.warn("⚠️ Media directory does NOT exist: {}", mediaDir.getAbsolutePath());
        }
    }

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        logger.info("🔄 Configuring static resource handlers...");

        String mediaPath = "file:" + mediaUploadDir + "/";

        logger.info("📁 Registering media path: {}", mediaPath);

        registry.addResourceHandler("/media/**")
                .addResourceLocations(mediaPath)
                .setCachePeriod(3600);

        logger.info("✅ Media resources registered for: /media/** -> {}", mediaPath);

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