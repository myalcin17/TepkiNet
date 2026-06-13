package com.mehmet.tepkinet.repository;

import com.mehmet.tepkinet.entity.Complaint;
import com.mehmet.tepkinet.entity.ComplaintStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint,Long>{
    List<Complaint> findByUserId(Long userId);  
    List<Complaint> findByCompanyId(Long companyId);
    List<Complaint> findByCompanyIdOrderByCreatedAtDesc(Long companyId);
    List<Complaint> findByStatus( ComplaintStatus status);
    List<Complaint> findByTitleContainingIgnoreCase(String keyword);
    List<Complaint> findAllByOrderByCreatedAtDesc();
}



