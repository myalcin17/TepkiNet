package com.mehmet.tepkinet.repository;

import com.mehmet.tepkinet.entity.Response;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResponseRepository extends JpaRepository<Response, Long> {

    List<Response> findByComplaintId(Long complaintId);

    List<Response> findByUserId(Long userId);
}