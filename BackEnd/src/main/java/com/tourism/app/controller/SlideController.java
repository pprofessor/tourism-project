package com.tourism.app.controller;

import com.tourism.app.entity.Slide;
import com.tourism.app.service.SlideService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/slides")
@CrossOrigin(origins = "*")
public class SlideController {
    
    @Autowired
    private SlideService slideService;
    
    @GetMapping("/active")
    public ResponseEntity<?> getActiveSlides() {
        try {
            List<Slide> slides = slideService.getActiveSlides();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", slides);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createSlide(@RequestBody Slide slide) {
        try {
            Slide createdSlide = slideService.createSlide(slide);
            return ResponseEntity.ok(Map.of(
                "success", true, 
                "message", "اسلاید ایجاد شد",
                "data", createdSlide
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSlide(@PathVariable Long id, @RequestBody Slide slide) {
        try {
            Slide updatedSlide = slideService.updateSlide(id, slide);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "اسلاید بروزرسانی شد", 
                "data", updatedSlide
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSlide(@PathVariable Long id) {
        try {
            slideService.deleteSlide(id);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "اسلاید حذف شد"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}