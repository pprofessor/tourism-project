package com.tourism.app.repository;

import com.tourism.app.entity.Slide;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SlideRepository extends JpaRepository<Slide, Long> {
    List<Slide> findByIsActiveTrueOrderByDisplayOrderAsc();
    List<Slide> findAllByOrderByDisplayOrderAsc();
}