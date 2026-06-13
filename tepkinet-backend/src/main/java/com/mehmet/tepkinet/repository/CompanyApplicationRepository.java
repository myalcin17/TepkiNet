package com.mehmet.tepkinet.repository;

import com.mehmet.tepkinet.entity.CompanyApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompanyApplicationRepository extends JpaRepository<CompanyApplication, Long> {
    boolean existsByCompanyEmail(String companyEmail);
    boolean existsByPhone(String phone);
    boolean existsByTaxNumber(String taxNumber);
    Optional<CompanyApplication> findByCompanyEmail(String companyEmail);
}
