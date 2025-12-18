package com.tourism.app.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "countries")
@Data // تولید getter, setter, toString, equals, hashCode
@NoArgsConstructor // constructor بدون پارامتر
@AllArgsConstructor // constructor با تمام پارامترها
@Builder // برای ساخت object با pattern Builder
public class Country {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code", nullable = false, unique = true)
    private String code;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "name_en")
    private String nameEn;

    @Column(name = "name_fa")
    private String nameFa;

    @Column(name = "name_ar")
    private String nameAr;

    @Column(name = "name_tr")
    private String nameTr;

    @Column(name = "country_code")
    private String countryCode;

    @Column(name = "phone_code")
    private String phoneCode;

    @Column(name = "flag_emoji")
    private String flagEmoji;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "active")
    private Boolean active;
}