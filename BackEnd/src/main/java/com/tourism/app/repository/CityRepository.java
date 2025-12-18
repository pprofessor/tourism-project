package com.tourism.app.repository;

import com.tourism.app.entity.City;
import com.tourism.app.entity.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CityRepository extends JpaRepository<City, Long> {
    List<City> findByCountry(Country country);

    List<City> findByCountryAndIsMajorTrue(Country country);

    List<City> findByIsMajorTrue();

    @Query("SELECT c FROM City c WHERE " +
            "(:countryId IS NULL OR c.country.id = :countryId) AND " +
            "(:isMajor IS NULL OR c.isMajor = :isMajor)")
    List<City> findCities(
            @Param("countryId") Long countryId,
            @Param("isMajor") Boolean isMajor);
}