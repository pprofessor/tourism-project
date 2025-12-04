package com.tourism.app.service;

import com.tourism.app.entity.SliderSettings;
import com.tourism.app.repository.SliderSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SliderSettingsService {

    @Autowired
    private SliderSettingsRepository sliderSettingsRepository;

    public SliderSettings getSettings() {
        List<SliderSettings> settingsList = sliderSettingsRepository.findAll();
        if (settingsList.isEmpty()) {
            // اگر تنظیماتی وجود ندارد، یک تنظیمات پیش‌فرض ایجاد کن
            SliderSettings defaultSettings = new SliderSettings();
            return sliderSettingsRepository.save(defaultSettings);
        }
        return settingsList.get(0); // اولین رکورد را برگردان
    }

    public SliderSettings saveSettings(SliderSettings settings) {
        List<SliderSettings> settingsList = sliderSettingsRepository.findAll();
        SliderSettings existingSettings;

        if (settingsList.isEmpty()) {
            existingSettings = new SliderSettings();
        } else {
            existingSettings = settingsList.get(0);
        }

        // آپدیت فیلدها
        if (settings.getSliderHeight() != null) {
            existingSettings.setSliderHeight(settings.getSliderHeight());
        }
        if (settings.getAutoPlay() != null) {
            existingSettings.setAutoPlay(settings.getAutoPlay());
        }
        if (settings.getSlideInterval() != null) {
            existingSettings.setSlideInterval(settings.getSlideInterval());
        }
        if (settings.getNavigationType() != null) {
            existingSettings.setNavigationType(settings.getNavigationType());
        }
        if (settings.getTransitionType() != null) {
            existingSettings.setTransitionType(settings.getTransitionType());
        }
        if (settings.getTransitionDuration() != null) {
            existingSettings.setTransitionDuration(settings.getTransitionDuration());
        }

        // آپدیت زمان
        existingSettings.setUpdatedAt(LocalDateTime.now());

        return sliderSettingsRepository.save(existingSettings);
    }
}