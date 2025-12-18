package com.tourism.app.controller;

import com.tourism.app.entity.Country;
import com.tourism.app.entity.City;
import com.tourism.app.repository.CountryRepository;
import com.tourism.app.repository.CityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/locations")
@CrossOrigin(origins = "*")
public class LocationController {

    @Autowired
    private CountryRepository countryRepository;

    @Autowired
    private CityRepository cityRepository;

    // ============ COUNTRIES ============

    // دریافت لیست تمام کشورها (فعال)
    @GetMapping("/countries")
    public ResponseEntity<?> getAllCountries() {
        try {
            List<Country> countries = countryRepository.findByActiveTrue();
            return ResponseEntity.ok(countries);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Failed to fetch countries: " + e.getMessage()));
        }
    }

    // دریافت کشور بر اساس کد
    @GetMapping("/countries/{countryCode}")
    public ResponseEntity<?> getCountryByCode(@PathVariable String countryCode) {
        try {
            Country country = countryRepository.findByCountryCode(countryCode.toUpperCase());
            if (country == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(country);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Failed to fetch country: " + e.getMessage()));
        }
    }

    // ============ CITIES ============

    // دریافت لیست تمام شهرها (با فیلتر اختیاری)
    @GetMapping("/cities")
    public ResponseEntity<?> getAllCities(
            @RequestParam(required = false) Long countryId,
            @RequestParam(required = false) Boolean isMajor) {
        try {
            List<City> cities;

            if (countryId != null && isMajor != null) {
                // شهرهای اصلی یک کشور خاص
                Optional<Country> countryOpt = countryRepository.findById(countryId);
                if (countryOpt.isEmpty()) {
                    return ResponseEntity.badRequest().body(
                            Map.of("error", "Country not found with id: " + countryId));
                }
                cities = cityRepository.findByCountryAndIsMajorTrue(countryOpt.get());
            } else if (countryId != null) {
                // همه شهرهای یک کشور
                Optional<Country> countryOpt = countryRepository.findById(countryId);
                if (countryOpt.isEmpty()) {
                    return ResponseEntity.badRequest().body(
                            Map.of("error", "Country not found with id: " + countryId));
                }
                cities = cityRepository.findByCountry(countryOpt.get());
            } else if (isMajor != null && isMajor) {
                // فقط شهرهای اصلی همه کشورها
                cities = cityRepository.findByIsMajorTrue();
            } else {
                // همه شهرها
                cities = cityRepository.findAll();
            }

            return ResponseEntity.ok(cities);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Failed to fetch cities: " + e.getMessage()));
        }
    }

    // دریافت شهرهای اصلی (همان endpoint موجود در مستندات)
    @GetMapping("/cities/major")
    public ResponseEntity<?> getMajorCities(
            @RequestParam(required = false) Long countryId) {
        try {
            List<City> cities;

            if (countryId != null) {
                // شهرهای اصلی یک کشور خاص
                Optional<Country> countryOpt = countryRepository.findById(countryId);
                if (countryOpt.isEmpty()) {
                    return ResponseEntity.badRequest().body(
                            Map.of("error", "Country not found with id: " + countryId));
                }
                cities = cityRepository.findByCountryAndIsMajorTrue(countryOpt.get());
            } else {
                // همه شهرهای اصلی
                cities = cityRepository.findByIsMajorTrue();
            }

            return ResponseEntity.ok(cities);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Failed to fetch major cities: " + e.getMessage()));
        }
    }

    // دریافت شهر بر اساس ID
    @GetMapping("/cities/{id}")
    public ResponseEntity<?> getCityById(@PathVariable Long id) {
        try {
            Optional<City> cityOpt = cityRepository.findById(id);
            if (cityOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(cityOpt.get());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Failed to fetch city: " + e.getMessage()));
        }
    }
}