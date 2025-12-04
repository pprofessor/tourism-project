package com.tourism.app.repository;

import com.tourism.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Optional<User> findByMobile(String mobile);

    Optional<User> findByMobileAndVerificationCode(String mobile, String verificationCode);

    long countByRole(String role);

}