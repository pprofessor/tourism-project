package com.tourism.app.seed;

import com.tourism.app.entity.Country;
import com.tourism.app.entity.City;
import com.tourism.app.repository.CountryRepository;
import com.tourism.app.repository.CityRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder {

    @Autowired
    private CountryRepository countryRepository;

    @Autowired
    private CityRepository cityRepository;

    @PostConstruct
    public void init() {
        if (countryRepository.count() == 0) {
            seedCountries();
            seedCities();
        }
    }

    private void seedCountries() {
        // استفاده از Builder Pattern
        Country iran = Country.builder()
                .code("IR")
                .name("Iran")
                .nameFa("ایران")
                .nameEn("Iran")
                .countryCode("IR")
                .phoneCode("+98")
                .flagEmoji("🇮🇷")
                .isActive(true)
                .active(true)
                .build();
        countryRepository.save(iran);

        Country turkey = Country.builder()
                .code("TR")
                .name("Turkey")
                .nameFa("ترکیه")
                .nameEn("Turkey")
                .countryCode("TR")
                .phoneCode("+90")
                .flagEmoji("🇹🇷")
                .isActive(true)
                .active(true)
                .build();
        countryRepository.save(turkey);

        Country uae = Country.builder()
                .code("AE")
                .name("United Arab Emirates")
                .nameFa("امارات متحده عربی")
                .nameEn("UAE")
                .countryCode("AE")
                .phoneCode("+971")
                .flagEmoji("🇦🇪")
                .isActive(true)
                .active(true)
                .build();
        countryRepository.save(uae);

        Country saudi = Country.builder()
                .code("SA")
                .name("Saudi Arabia")
                .nameFa("عربستان سعودی")
                .nameEn("Saudi Arabia")
                .countryCode("SA")
                .phoneCode("+966")
                .flagEmoji("🇸🇦")
                .isActive(true)
                .active(true)
                .build();
        countryRepository.save(saudi);

        System.out.println("✓ 4 countries seeded successfully");
    }

    private void seedCities() {
        // پیدا کردن کشورها
        Country iran = countryRepository.findByCountryCode("IR");
        Country turkey = countryRepository.findByCountryCode("TR");
        Country uae = countryRepository.findByCountryCode("AE");
        Country saudi = countryRepository.findByCountryCode("SA");

        // شهرهای ایران با Builder
        cityRepository.save(City.builder()
                .name("Tehran")
                .nameFa("تهران")
                .country(iran)
                .isMajor(true)
                .isActive(true)
                .build());

        cityRepository.save(City.builder()
                .name("Mashhad")
                .nameFa("مشهد")
                .country(iran)
                .isMajor(true)
                .isActive(true)
                .build());

        cityRepository.save(City.builder()
                .name("Isfahan")
                .nameFa("اصفهان")
                .country(iran)
                .isMajor(true)
                .isActive(true)
                .build());

        cityRepository.save(City.builder()
                .name("Shiraz")
                .nameFa("شیراز")
                .country(iran)
                .isMajor(true)
                .isActive(true)
                .build());

        cityRepository.save(City.builder()
                .name("Tabriz")
                .nameFa("تبریز")
                .country(iran)
                .isMajor(true)
                .isActive(true)
                .build());

        // شهرهای ترکیه
        cityRepository.save(City.builder()
                .name("Istanbul")
                .nameFa("استانبول")
                .country(turkey)
                .isMajor(true)
                .isActive(true)
                .build());

        cityRepository.save(City.builder()
                .name("Ankara")
                .nameFa("آنکارا")
                .country(turkey)
                .isMajor(true)
                .isActive(true)
                .build());

        cityRepository.save(City.builder()
                .name("Izmir")
                .nameFa("ازمیر")
                .country(turkey)
                .isMajor(true)
                .isActive(true)
                .build());

        cityRepository.save(City.builder()
                .name("Antalya")
                .nameFa("آنتالیا")
                .country(turkey)
                .isMajor(true)
                .isActive(true)
                .build());

        // شهرهای امارات
        cityRepository.save(City.builder()
                .name("Dubai")
                .nameFa("دبی")
                .country(uae)
                .isMajor(true)
                .isActive(true)
                .build());

        cityRepository.save(City.builder()
                .name("Abu Dhabi")
                .nameFa("ابوظبی")
                .country(uae)
                .isMajor(true)
                .isActive(true)
                .build());

        cityRepository.save(City.builder()
                .name("Sharjah")
                .nameFa("شارجه")
                .country(uae)
                .isMajor(true)
                .isActive(true)
                .build());

        // شهرهای عربستان
        cityRepository.save(City.builder()
                .name("Riyadh")
                .nameFa("ریاض")
                .country(saudi)
                .isMajor(true)
                .isActive(true)
                .build());

        cityRepository.save(City.builder()
                .name("Jeddah")
                .nameFa("جده")
                .country(saudi)
                .isMajor(true)
                .isActive(true)
                .build());

        cityRepository.save(City.builder()
                .name("Mecca")
                .nameFa("مکه")
                .country(saudi)
                .isMajor(true)
                .isActive(true)
                .build());

        System.out.println("✓ Cities seeded successfully");
    }
}