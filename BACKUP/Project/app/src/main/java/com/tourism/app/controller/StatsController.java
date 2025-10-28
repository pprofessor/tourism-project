package com.tourism.app.controller;

import com.tourism.app.repository.HotelRepository;
import com.tourism.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
public class StatsController {

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/stats/dashboard")
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // آمار هتل‌ها
        long totalHotels = hotelRepository.count();
        stats.put("totalHotels", totalHotels);
        
        // آمار کاربران
        long totalUsers = userRepository.count();
        long adminUsers = userRepository.countByRole("ADMIN");
        long regularUsers = userRepository.countByRole("USER");
        
        stats.put("totalUsers", totalUsers);
        stats.put("adminUsers", adminUsers);
        stats.put("regularUsers", regularUsers);
        
        // آمار قیمت‌ها
        Double avgPrice = hotelRepository.getAveragePrice();
        stats.put("averageHotelPrice", avgPrice != null ? avgPrice : 0);
        
        return stats;
    }
}