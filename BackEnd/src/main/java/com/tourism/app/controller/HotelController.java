package com.tourism.app.controller;

import com.tourism.app.dto.HotelRequest;
import com.tourism.app.model.Hotel;
import com.tourism.app.service.HotelService;
import com.tourism.app.repository.HotelRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/hotels")
@CrossOrigin(origins = "*")
public class HotelController {

    @Autowired
    private HotelService hotelService;

    @Autowired
    private HotelRepository hotelRepository;

    // دریافت همه هتل‌ها
    @GetMapping
    public List<Hotel> getAllHotels() {
        return hotelService.getAllHotels();
    }

    // دریافت هتل‌های فعال
    @GetMapping("/active")
    public List<Hotel> getActiveHotels() {
        return hotelService.getActiveHotels();
    }

    // دریافت هتل بر اساس ID
    @GetMapping("/{id}")
    public ResponseEntity<Hotel> getHotelById(@PathVariable Long id) {
        Optional<Hotel> hotel = hotelService.getHotelById(id);
        return hotel.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // ایجاد هتل جدید با validation
    @PostMapping
    public ResponseEntity<?> createHotel(@Valid @RequestBody HotelRequest hotelRequest) {
        try {
            Hotel savedHotel = hotelService.createHotel(hotelRequest);
            return ResponseEntity.ok(savedHotel);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to create hotel");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    // آپدیت کامل هتل با validation
    @PutMapping("/{id}")
    public ResponseEntity<?> updateHotel(@PathVariable Long id, @Valid @RequestBody HotelRequest hotelDetails) {
        Optional<Hotel> updatedHotel = hotelService.updateHotel(id, hotelDetails);
        return updatedHotel.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // حذف هتل
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteHotel(@PathVariable Long id) {
        boolean deleted = hotelService.deleteHotel(id);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", deleted);
        return deleted ? ResponseEntity.ok(response) : ResponseEntity.notFound().build();
    }

    // غیرفعال کردن هتل (Soft Delete)
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<Hotel> deactivateHotel(@PathVariable Long id) {
        Optional<Hotel> updatedHotel = hotelService.deactivateHotel(id);
        return updatedHotel.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // جستجوی هتل‌ها بر اساس شهر
    @GetMapping("/city/{city}")
    public List<Hotel> getHotelsByCity(@PathVariable String city) {
        return hotelRepository.findByCityAndIsActiveTrue(city);
    }

    // جستجوی هتل‌ها بر اساس کشور
    @GetMapping("/country/{country}")
    public List<Hotel> getHotelsByCountry(@PathVariable String country) {
        return hotelRepository.findByCountryAndIsActiveTrue(country);
    }

    // جستجوی هتل‌ها با اتاق خالی
    @GetMapping("/available")
    public List<Hotel> getHotelsWithAvailableRooms() {
        return hotelRepository.findHotelsWithAvailableRooms();
    }

    // جستجوی هتل‌ها با تخفیف فعال
    @GetMapping("/discounts/active")
    public List<Hotel> getHotelsWithActiveDiscount() {
        return hotelRepository.findHotelsWithActiveDiscount();
    }

    // جستجوی پیشرفته هتل‌ها
    @GetMapping("/search")
    public ResponseEntity<List<Hotel>> searchHotels(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(required = false) Boolean hasPool) {

        List<Hotel> hotels = hotelService.searchHotels(city, minPrice, maxPrice, sortBy, page, hasPool);
        return ResponseEntity.ok(hotels);
    }

    // آپدیت تعداد اتاق‌های موجود
    @PutMapping("/{id}/rooms")
    public ResponseEntity<Hotel> updateAvailableRooms(@PathVariable Long id, @RequestParam Integer availableRooms) {
        Optional<Hotel> hotelOptional = hotelService.getHotelById(id);
        if (hotelOptional.isPresent()) {
            Hotel hotel = hotelOptional.get();
            hotel.setAvailableRooms(availableRooms);
            Hotel updatedHotel = hotelRepository.save(hotel);
            return ResponseEntity.ok(updatedHotel);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // اعمال تخفیف به هتل
    @PutMapping("/{id}/discount")
    public ResponseEntity<Hotel> applyDiscount(
            @PathVariable Long id,
            @RequestParam Double discountPercentage,
            @RequestParam(required = false) String discountCode,
            @RequestParam(required = false) String discountExpiry) {

        Optional<Hotel> hotelOptional = hotelService.getHotelById(id);
        if (hotelOptional.isPresent()) {
            Hotel hotel = hotelOptional.get();
            hotel.setDiscountPercentage(discountPercentage);
            hotel.setDiscountCode(discountCode);
            Hotel updatedHotel = hotelRepository.save(hotel);
            return ResponseEntity.ok(updatedHotel);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // آمار هتل‌ها
    @GetMapping("/stats")
    public Map<String, Object> getHotelStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalHotels", hotelRepository.count());
        stats.put("activeHotels", hotelRepository.countActiveHotels());
        stats.put("averagePrice", hotelRepository.getAveragePrice());
        return stats;
    }
}