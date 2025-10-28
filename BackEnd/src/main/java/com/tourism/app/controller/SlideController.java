package com.tourism.app.controller;

import com.tourism.app.entity.Slide;
import com.tourism.app.repository.SlideRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/slides")
@CrossOrigin(origins = "http://localhost:3000")
public class SlideController {
    
    @Autowired
    private SlideRepository slideRepository;
    
    @GetMapping
    public List<Slide> getActiveSlides() {
        return slideRepository.findByIsActiveTrueOrderBySortOrderAsc();
    }
}