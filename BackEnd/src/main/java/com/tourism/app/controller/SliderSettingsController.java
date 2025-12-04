package com.tourism.app.controller;

import com.tourism.app.entity.SliderSettings;
import com.tourism.app.service.SliderSettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/slider")
public class SliderSettingsController {

    @Autowired
    private SliderSettingsService sliderSettingsService;

    @GetMapping("/settings")
    public ResponseEntity<?> getSliderSettings() {
        try {
            SliderSettings settings = sliderSettingsService.getSettings();
            return ResponseEntity.ok(settings);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching settings: " + e.getMessage());
        }
    }

    @PostMapping("/settings")
    public ResponseEntity<?> saveSliderSettings(@RequestBody SliderSettings settings) {
        try {
            SliderSettings savedSettings = sliderSettingsService.saveSettings(settings);
            return ResponseEntity.ok(savedSettings);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error saving settings: " + e.getMessage());
        }
    }
}