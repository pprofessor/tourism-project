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
        System.out.println(" Application started successfully on port 8080   ");

        File mediaDir = new File(mediaUploadDir);
        if (mediaDir.exists()) {
        } else {
        }
    }

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {

        String mediaPath = "file:" + mediaUploadDir + "/";

        registry.addResourceHandler("/media/**")
                .addResourceLocations(mediaPath)
                .setCachePeriod(3600);

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

    }
}