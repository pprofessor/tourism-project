package com.tourism.app.controller;

import com.tourism.app.model.Booking;
import com.tourism.app.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    // دریافت تمام سرویس‌های کاربر
    @GetMapping("/user/{userId}")
    public Map<String, Object> getUserBookings(@PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Booking> bookings = bookingRepository.findByUserIdOrderByCreatedAtDesc(userId);
            
            response.put("success", true);
            response.put("bookings", bookings);
            response.put("total", bookings.size());
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "خطا در دریافت سرویس‌ها");
        }
        
        return response;
    }

    // ایجاد سرویس جدید
    @PostMapping("/create")
    public Map<String, Object> createBooking(@RequestBody Map<String, Object> bookingRequest) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Booking booking = new Booking();
            booking.setUserId(Long.valueOf(bookingRequest.get("userId").toString()));
            booking.setBookingType((String) bookingRequest.get("bookingType"));
            booking.setServiceName((String) bookingRequest.get("serviceName"));
            booking.setServiceDescription((String) bookingRequest.get("serviceDescription"));
            booking.setPrice(new java.math.BigDecimal(bookingRequest.get("price").toString()));
            booking.setBookingId("book_" + System.currentTimeMillis());
            
            if (bookingRequest.get("checkInDate") != null) {
                booking.setCheckInDate((String) bookingRequest.get("checkInDate"));
            }
            if (bookingRequest.get("checkOutDate") != null) {
                booking.setCheckOutDate((String) bookingRequest.get("checkOutDate"));
            }
            if (bookingRequest.get("guests") != null) {
                booking.setGuests(Integer.valueOf(bookingRequest.get("guests").toString()));
            }
            
            bookingRepository.save(booking);
            
            response.put("success", true);
            response.put("message", "سرویس با موفقیت رزرو شد");
            response.put("bookingId", booking.getBookingId());
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "خطا در رزرو سرویس");
        }
        
        return response;
    }
}