package com.tourism.app.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        String basePath = "file:D:/Project/Media/";
        
        System.out.println("🔗 ثبت مسیر استاتیک برای مدیا: " + basePath);
        
        // دسترسی به تمام پوشه‌های دسته‌بندی
        registry.addResourceHandler("/media/**")
                .addResourceLocations(
                    basePath + "Images/",
                    basePath + "Videos/", 
                    basePath + "Audios/",
                    basePath + "Others/"
                );
        
        System.out.println("📁 پوشه‌های دسته‌بندی ثبت شد:");
        System.out.println("   - " + basePath + "Images/");
        System.out.println("   - " + basePath + "Videos/");
        System.out.println("   - " + basePath + "Audios/");
        System.out.println("   - " + basePath + "Others/");
        
        // کانفیگ قبلی برای compatibility
        String uploadsPath = "file:./uploads/";
        System.out.println("🔗 ثبت مسیر استاتیک برای آپلودها: " + uploadsPath);
        
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
    }
}