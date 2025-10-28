package com.tourism.app.controller;

import com.tourism.app.entity.Slide;
import com.tourism.app.repository.SlideRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/slides")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}) // اضافه کردن پنل ادمین
public class AdminSlideController {
    
    @Autowired
    private SlideRepository slideRepository;
    
    @GetMapping
    public List<Slide> getAllSlides() {
        return slideRepository.findAll(Sort.by(Sort.Direction.ASC, "sortOrder"));
    }
    
    @PostMapping
    public Slide createSlide(@RequestBody Slide slide) {
        return slideRepository.save(slide);
    }
    
    @PutMapping("/{id}")
    public Slide updateSlide(@PathVariable Long id, @RequestBody Slide slide) {
        slide.setId(id);
        return slideRepository.save(slide);
    }
    
    @DeleteMapping("/{id}")
    public void deleteSlide(@PathVariable Long id) {
        slideRepository.deleteById(id);
    }
}