package com.tourism.app.service;

import com.tourism.app.dto.HotelRequest;
import com.tourism.app.model.Hotel;
import com.tourism.app.repository.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HotelService {

    @Autowired
    private HotelRepository hotelRepository;

    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }

    public List<Hotel> getActiveHotels() {
        return hotelRepository.findByIsActiveTrue();
    }

    public Optional<Hotel> getHotelById(Long id) {
        return hotelRepository.findById(id);
    }

    public Hotel createHotel(HotelRequest hotelRequest) {
        Hotel hotel = new Hotel();
        mapHotelRequestToEntity(hotelRequest, hotel);
        return hotelRepository.save(hotel);
    }

    public Optional<Hotel> updateHotel(Long id, HotelRequest hotelDetails) {
        Optional<Hotel> hotelOptional = hotelRepository.findById(id);
        if (hotelOptional.isPresent()) {
            Hotel hotel = hotelOptional.get();
            mapHotelRequestToEntity(hotelDetails, hotel);
            return Optional.of(hotelRepository.save(hotel));
        }
        return Optional.empty();
    }

    public boolean deleteHotel(Long id) {
        Optional<Hotel> hotel = hotelRepository.findById(id);
        if (hotel.isPresent()) {
            hotelRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Optional<Hotel> deactivateHotel(Long id) {
        Optional<Hotel> hotelOptional = hotelRepository.findById(id);
        if (hotelOptional.isPresent()) {
            Hotel hotel = hotelOptional.get();
            hotel.setIsActive(false);
            return Optional.of(hotelRepository.save(hotel));
        }
        return Optional.empty();
    }

    public List<Hotel> searchHotels(String city, Double minPrice, Double maxPrice,
            String sortBy, Integer page, Boolean hasPool) {
        return hotelRepository.searchHotels(city, minPrice, maxPrice, sortBy, page, hasPool);
    }

    // سایر متدهای سرویس...

    private void mapHotelRequestToEntity(HotelRequest request, Hotel hotel) {
        hotel.setName(request.getName());
        hotel.setDescription(request.getDescription());
        hotel.setAddress(request.getAddress());
        hotel.setCity(request.getCity());
        hotel.setCountry(request.getCountry());
        hotel.setBasePrice(request.getBasePrice());
        hotel.setTotalRooms(request.getTotalRooms());
        hotel.setStarRating(request.getStarRating());
        hotel.setEmail(request.getEmail());
        hotel.setPhone(request.getPhone());
    }
}