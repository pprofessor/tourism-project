package com.tourism.app.repository;

import com.tourism.app.entity.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CountryRepository extends JpaRepository<Country, Long> {
    List<Country> findByActiveTrue();

    Country findByCountryCode(String countryCode);
}