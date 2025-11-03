package com.tourism.app.controller;

import com.tourism.app.model.Hotel;
import com.tourism.app.repository.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class HotelController {

    @Autowired
    private HotelRepository hotelRepository;

    @GetMapping("/hotels")
    public List<Hotel> getHotels() {
        return hotelRepository.findAll();
    }

    @PostMapping("/hotels")
    public Hotel createHotel(@RequestBody Hotel hotel) {
        return hotelRepository.save(hotel);
    }

    @PutMapping("/hotels/{id}")
    public Hotel updateHotel(@PathVariable Long id, @RequestBody Hotel hotelDetails) {
        Hotel hotel = hotelRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Hotel not found"));
        
        hotel.setName(hotelDetails.getName());
        hotel.setLocation(hotelDetails.getLocation());
        hotel.setPrice(hotelDetails.getPrice());
        hotel.setImageUrl(hotelDetails.getImageUrl()); // تغییر از setImage و getImage به setImageUrl و getImageUrl
        
        return hotelRepository.save(hotel);
    }

    @DeleteMapping("/hotels/{id}")
    public void deleteHotel(@PathVariable Long id) {
        hotelRepository.deleteById(id);
    }
}