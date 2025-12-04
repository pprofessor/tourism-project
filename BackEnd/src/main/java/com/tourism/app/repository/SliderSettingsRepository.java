package com.tourism.app.repository;

import com.tourism.app.entity.SliderSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SliderSettingsRepository extends JpaRepository<SliderSettings, Long> {
}