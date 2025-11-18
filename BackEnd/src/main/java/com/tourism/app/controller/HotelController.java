package com.tourism.app.controller;

import com.tourism.app.model.Hotel;
import com.tourism.app.repository.HotelRepository;
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
    private HotelRepository hotelRepository;

    // دریافت همه هتل‌ها
    @GetMapping
    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }

    // دریافت هتل‌های فعال
    @GetMapping("/active")
    public List<Hotel> getActiveHotels() {
        return hotelRepository.findByIsActiveTrue();
    }

    // دریافت هتل بر اساس ID
    @GetMapping("/{id}")
    public ResponseEntity<Hotel> getHotelById(@PathVariable Long id) {
        Optional<Hotel> hotel = hotelRepository.findById(id);
        return hotel.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // ایجاد هتل جدید
    @PostMapping
    public Hotel createHotel(@RequestBody Hotel hotel) {
        return hotelRepository.save(hotel);
    }

    // آپدیت کامل هتل
    @PutMapping("/{id}")
    public ResponseEntity<Hotel> updateHotel(@PathVariable Long id, @RequestBody Hotel hotelDetails) {
        Optional<Hotel> hotelOptional = hotelRepository.findById(id);

        if (hotelOptional.isPresent()) {
            Hotel hotel = hotelOptional.get();

            // آپدیت فیلدها
            hotel.setName(hotelDetails.getName());
            hotel.setDescription(hotelDetails.getDescription());
            hotel.setAddress(hotelDetails.getAddress());
            hotel.setCity(hotelDetails.getCity());
            hotel.setCountry(hotelDetails.getCountry());
            hotel.setPostalCode(hotelDetails.getPostalCode());
            hotel.setLatitude(hotelDetails.getLatitude());
            hotel.setLongitude(hotelDetails.getLongitude());
            hotel.setPhone(hotelDetails.getPhone());
            hotel.setEmail(hotelDetails.getEmail());
            hotel.setWebsite(hotelDetails.getWebsite());
            hotel.setBasePrice(hotelDetails.getBasePrice());
            hotel.setTotalRooms(hotelDetails.getTotalRooms());
            hotel.setAvailableRooms(hotelDetails.getAvailableRooms());
            hotel.setStarRating(hotelDetails.getStarRating());
            hotel.setRating(hotelDetails.getRating());
            hotel.setReviewCount(hotelDetails.getReviewCount());
            hotel.setHasPool(hotelDetails.getHasPool());
            hotel.setAmenities(hotelDetails.getAmenities());
            hotel.setImageUrls(hotelDetails.getImageUrls());
            hotel.setMainImageUrl(hotelDetails.getMainImageUrl());
            hotel.setIsActive(hotelDetails.getIsActive());
            hotel.setDiscountPercentage(hotelDetails.getDiscountPercentage());
            hotel.setDiscountCode(hotelDetails.getDiscountCode());
            hotel.setDiscountExpiry(hotelDetails.getDiscountExpiry());
            hotel.setSeoTitle(hotelDetails.getSeoTitle());
            hotel.setSeoDescription(hotelDetails.getSeoDescription());
            hotel.setSeoKeywords(hotelDetails.getSeoKeywords());

            Hotel updatedHotel = hotelRepository.save(hotel);
            return ResponseEntity.ok(updatedHotel);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // حذف هتل
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteHotel(@PathVariable Long id) {
        Optional<Hotel> hotel = hotelRepository.findById(id);

        if (hotel.isPresent()) {
            hotelRepository.deleteById(id);
            Map<String, Boolean> response = new HashMap<>();
            response.put("deleted", true);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // غیرفعال کردن هتل (Soft Delete)
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<Hotel> deactivateHotel(@PathVariable Long id) {
        Optional<Hotel> hotelOptional = hotelRepository.findById(id);

        if (hotelOptional.isPresent()) {
            Hotel hotel = hotelOptional.get();
            hotel.setIsActive(false);
            Hotel updatedHotel = hotelRepository.save(hotel);
            return ResponseEntity.ok(updatedHotel);
        } else {
            return ResponseEntity.notFound().build();
        }
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

        List<Hotel> hotels = hotelRepository.searchHotels(city, minPrice, maxPrice, sortBy, page, hasPool);
        return ResponseEntity.ok(hotels);
    }

    // آپدیت تعداد اتاق‌های موجود
    @PutMapping("/{id}/rooms")
    public ResponseEntity<Hotel> updateAvailableRooms(@PathVariable Long id, @RequestParam Integer availableRooms) {
        Optional<Hotel> hotelOptional = hotelRepository.findById(id);

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

        Optional<Hotel> hotelOptional = hotelRepository.findById(id);

        if (hotelOptional.isPresent()) {
            Hotel hotel = hotelOptional.get();
            hotel.setDiscountPercentage(discountPercentage);
            hotel.setDiscountCode(discountCode);
            // در اینجا می‌توانید discountExpiry رو parse کنید
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