package com.mehmet.tepkinet.repository;

import com.mehmet.tepkinet.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    List<Company> findAllByVerifiedTrue();
    boolean existsByCompanyName(String companyName);
    Optional<Company> findByUsersEmail(String email);
}
