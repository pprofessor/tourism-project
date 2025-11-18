package com.tourism.app.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Value("${ALLOWED_ORIGINS:http://localhost:3000,http://localhost:4000}")
    private String allowedOrigins;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // تفکیک دامنه‌های مجاز
        List<String> origins = Arrays.asList(allowedOrigins.split(","));
        configuration.setAllowedOrigins(origins);

        // متدهای مجاز
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        // هدرهای مجاز (محدودتر و امن‌تر)
        configuration.setAllowedHeaders(Arrays.asList(
                "Authorization", "Content-Type", "X-Requested-With", "Accept",
                "Origin", "Access-Control-Request-Method", "Access-Control-Request-Headers",
                "X-CSRF-Token"));

        // هدرهای exposed
        configuration.setExposedHeaders(Arrays.asList(
                "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials",
                "Authorization"));

        // اجازه ارسال credentials
        configuration.setAllowCredentials(true);

        // Max age برای preflight requests (1 ساعت)
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        // محدود کردن به مسیرهای API (امن‌تر از /**)
        source.registerCorsConfiguration("/api/**", configuration);
        source.registerCorsConfiguration("/auth/**", configuration);

        return source;
    }
}