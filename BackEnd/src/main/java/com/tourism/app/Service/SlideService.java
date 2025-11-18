package com.tourism.app.service;

import com.tourism.app.entity.Slide;
import com.tourism.app.repository.SlideRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SlideService {

    @Autowired
    private SlideRepository slideRepository;

    public List<Slide> getActiveSlides() {
        return slideRepository.findByIsActiveTrueOrderByDisplayOrderAsc();
    }

    public Slide createSlide(Slide slide) {
        slide.setCreatedAt(LocalDateTime.now());
        slide.setUpdatedAt(LocalDateTime.now());
        return slideRepository.save(slide);
    }

    public Slide updateSlide(Long id, Slide slideDetails) {
        Slide slide = slideRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Slide not found"));

        slide.setTitle(slideDetails.getTitle());
        slide.setDescription(slideDetails.getDescription());
        slide.setImage(slideDetails.getImage());
        slide.setButtonLink(slideDetails.getButtonLink()); // تغییر از setTargetUrl به setButtonLink
        slide.setButtonText(slideDetails.getButtonText());
        slide.setAltText(slideDetails.getAltText());
        slide.setSeoTitle(slideDetails.getSeoTitle());
        slide.setSeoDescription(slideDetails.getSeoDescription());

        // فیلدهای جدید
        slide.setSlideType(slideDetails.getSlideType());
        slide.setMediaSource(slideDetails.getMediaSource());
        slide.setTransitionType(slideDetails.getTransitionType());
        slide.setNavigationType(slideDetails.getNavigationType());
        slide.setCustomNavigation(slideDetails.getCustomNavigation());
        slide.setDisplayOrder(slideDetails.getDisplayOrder());
        slide.setSlideInterval(slideDetails.getSlideInterval());
        slide.setTransitionDuration(slideDetails.getTransitionDuration());
        slide.setIsActive(slideDetails.getIsActive());
        slide.setUpdatedAt(LocalDateTime.now());

        return slideRepository.save(slide);
    }

    public void deleteSlide(Long id) {
        slideRepository.deleteById(id);
    }

    public List<Slide> getAllSlides() {
        return slideRepository.findAllByOrderByDisplayOrderAsc();
    }
}