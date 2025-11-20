package com.tourism.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AppApplication {

    public static void main(String[] args) {
        System.out.println("🚀 Starting Tourism Application...");
        SpringApplication.run(AppApplication.class, args);
    }
}