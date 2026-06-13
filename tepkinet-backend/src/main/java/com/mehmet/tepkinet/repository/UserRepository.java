package com.mehmet.tepkinet.repository;

import com.mehmet.tepkinet.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    User findByEmail(String email);
}

