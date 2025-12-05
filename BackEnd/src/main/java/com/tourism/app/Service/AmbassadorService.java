package com.tourism.app.service;

import com.tourism.app.entity.Ambassador;
import com.tourism.app.model.User;
import com.tourism.app.repository.AmbassadorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AmbassadorService {

    @Autowired
    private AmbassadorRepository ambassadorRepository;

    // ثبت سفیر جدید
    @Transactional
    public Ambassador createAmbassador(User user, Ambassador ambassadorData) {
        // بررسی آیا کاربر قبلاً سفیر شده
        Optional<Ambassador> existing = ambassadorRepository.findByUser(user);
        if (existing.isPresent()) {
            throw new RuntimeException("User is already an ambassador");
        }

        ambassadorData.setUser(user);
        return ambassadorRepository.save(ambassadorData);
    }

    // به‌روزرسانی اطلاعات سفیر
    @Transactional
    public Ambassador updateAmbassador(Long id, Ambassador updatedData) {
        Ambassador ambassador = ambassadorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ambassador not found"));

        // به‌روزرسانی فیلدها
        if (updatedData.getCity() != null) {
            ambassador.setCity(updatedData.getCity());
        }
        if (updatedData.getCountry() != null) {
            ambassador.setCountry(updatedData.getCountry());
        }
        if (updatedData.getLanguages() != null) {
            ambassador.setLanguages(updatedData.getLanguages());
        }
        if (updatedData.getServices() != null) {
            ambassador.setServices(updatedData.getServices());
        }
        if (updatedData.getHourlyRate() != null) {
            ambassador.setHourlyRate(updatedData.getHourlyRate());
        }
        if (updatedData.getBio() != null) {
            ambassador.setBio(updatedData.getBio());
        }
        if (updatedData.getIsAvailable() != null) {
            ambassador.setIsAvailable(updatedData.getIsAvailable());
        }

        return ambassadorRepository.save(ambassador);
    }

    // دریافت سفیر بر اساس ID
    public Ambassador getAmbassadorById(Long id) {
        return ambassadorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ambassador not found"));
    }

    // دریافت سفیر بر اساس کاربر
    public Ambassador getAmbassadorByUser(User user) {
        return ambassadorRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Ambassador not found for this user"));
    }

    // جستجوی سفیران
    public List<Ambassador> searchAmbassadors(
            String city,
            String country,
            Double minRate,
            Double maxRate,
            Double minRating) {
        return ambassadorRepository.searchAmbassadors(city, country, minRate, maxRate, minRating);
    }

    // دریافت سفیران یک شهر
    public List<Ambassador> getAmbassadorsByCity(String city) {
        return ambassadorRepository.findByCityAndIsAvailableTrue(city);
    }

    // دریافت سفیران verified
    public List<Ambassador> getVerifiedAmbassadors() {
        return ambassadorRepository.findByIsVerifiedTrue();
    }

    // تغییر وضعیت available
    @Transactional
    public Ambassador toggleAvailability(Long id, boolean isAvailable) {
        Ambassador ambassador = getAmbassadorById(id);
        ambassador.setIsAvailable(isAvailable);
        return ambassadorRepository.save(ambassador);
    }

    // به‌روزرسانی امتیاز سفیر
    @Transactional
    public Ambassador updateRating(Long id, Double newRating) {
        Ambassador ambassador = getAmbassadorById(id);

        // محاسبه امتیاز جدید (میانگین وزنی)
        Double currentRating = ambassador.getRating();
        Integer completedTasks = ambassador.getCompletedTasks();

        if (currentRating == 0.0) {
            ambassador.setRating(newRating);
        } else {
            Double totalScore = currentRating * completedTasks + newRating;
            ambassador.setRating(totalScore / (completedTasks + 1));
        }

        ambassador.setCompletedTasks(completedTasks + 1);
        return ambassadorRepository.save(ambassador);
    }

    // حذف سفیر
    @Transactional
    public void deleteAmbassador(Long id) {
        if (!ambassadorRepository.existsById(id)) {
            throw new RuntimeException("Ambassador not found");
        }
        ambassadorRepository.deleteById(id);
    }
}