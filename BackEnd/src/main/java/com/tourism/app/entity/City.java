package com.tourism.app.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cities")
@Data // برای getter/setter/toString/equals/hashCode
@NoArgsConstructor // constructor بدون پارامتر
@AllArgsConstructor // constructor با تمام پارامترها
@Builder // برای Pattern Builder
public class City {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "name_fa")
    private String nameFa;

    @ManyToOne
    @JoinColumn(name = "country_id", nullable = false)
    private Country country;

    @Column(name = "is_major")
    @Builder.Default // اینجا باید باشه
    private Boolean isMajor = false;

    @Column(name = "is_active", nullable = false)
    @Builder.Default // اینجا باید باشه
    private Boolean isActive = true;

    private Double latitude;
    private Double longitude;
}