package com.mehmet.tepkinet.repository;

import com.mehmet.tepkinet.entity.SupportMessage;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SupportMessageRepository extends JpaRepository<SupportMessage, Long> {

    List<SupportMessage>

    findByComplaintIdOrderByCreatedAtAsc(Long complaintId);
}