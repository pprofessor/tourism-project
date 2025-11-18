package com.tourism.app.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtUtil jwtUtil;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // غیرفعال کردن CSRF برای API
                .csrf(csrf -> csrf.disable())

                // تنظیم CORS - استفاده از CorsConfig موجود
                .cors(cors -> {
                })

                // مدیریت session - stateless برای API
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // تنظیم مجوزهای دسترسی
                .authorizeHttpRequests(authz -> authz
                        // endpointهای عمومی و استاتیک
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/hotels/**",
                                "/api/slides/**",
                                "/api/media/**",
                                "/uploads/**",
                                "/media/**",
                                "/error",
                                "/static/**",
                                "/resources/**",
                                "/webjars/**")
                        .permitAll()

                        // endpointهای مدیریتی - نیاز به احراز هویت
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // سایر درخواست‌ها نیاز به احراز هویت دارند
                        .anyRequest().authenticated())

                // اضافه کردن JWT Filter
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)

                // مدیریت خطاها
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(401);
                            response.setContentType("application/json");
                            response.getWriter()
                                    .write("{\"error\": \"Unauthorized\", \"message\": \"Authentication required\"}");
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(403);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"error\": \"Forbidden\", \"message\": \"Access denied\"}");
                        }));

        return http.build();
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtUtil);
    }
}