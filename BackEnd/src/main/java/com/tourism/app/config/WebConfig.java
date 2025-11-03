package com.tourism.app.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    private static final Logger logger = LoggerFactory.getLogger(WebConfig.class);
    
    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        String basePath = "file:D:/Project/Media/";
        
        logger.info("[CONFIG] Registering static media path: {}", basePath);
        
        // دسترسی به تمام پوشه‌های دسته‌بندی
        registry.addResourceHandler("/media/**")
                .addResourceLocations(
                    basePath + "Images/",
                    basePath + "Videos/", 
                    basePath + "Audios/",
                    basePath + "Others/"
                );
        
        logger.debug("[CONFIG] Category directories registered:");
        logger.debug("[CONFIG]   - {}{}", basePath, "Images/");
        logger.debug("[CONFIG]   - {}{}", basePath, "Videos/");
        logger.debug("[CONFIG]   - {}{}", basePath, "Audios/");
        logger.debug("[CONFIG]   - {}{}", basePath, "Others/");
        
        
        // کانفیگ قبلی برای compatibility
        String uploadsPath = "file:./uploads/";
        logger.info("[CONFIG] Registering uploads path: {}", uploadsPath);
        
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadsPath);
        
        // منابع استاتیک پیشفرض Spring
        registry.addResourceHandler("/**")
                .addResourceLocations(
                    "classpath:/META-INF/resources/",
                    "classpath:/resources/", 
                    "classpath:/static/",
                    "classpath:/public/"
                );
        
        logger.info("[SUCCESS] Static resource configuration completed");
    }
}