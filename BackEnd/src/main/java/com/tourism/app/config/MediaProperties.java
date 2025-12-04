// File: BackEnd/src/main/java/com/tourism/app/config/MediaProperties.java
package com.tourism.app.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.media")
public class MediaProperties {
    
    private String uploadDir = "D:/Project/Media";
    private String maxFileSize = "50MB";
    private String allowedExtensions = "jpg,jpeg,png,gif,webp,bmp,svg,mp4,avi,mov,wmv,mkv,mp3,wav,ogg,aac,flac,pdf,doc,docx,txt";

    // Getters and Setters
    public String getUploadDir() {
        return uploadDir;
    }

    public void setUploadDir(String uploadDir) {
        this.uploadDir = uploadDir;
    }

    public String getMaxFileSize() {
        return maxFileSize;
    }

    public void setMaxFileSize(String maxFileSize) {
        this.maxFileSize = maxFileSize;
    }

    public String getAllowedExtensions() {
        return allowedExtensions;
    }

    public void setAllowedExtensions(String allowedExtensions) {
        this.allowedExtensions = allowedExtensions;
    }
}