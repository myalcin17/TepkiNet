package com.mehmet.tepkinet.service;

import com.mehmet.tepkinet.dto.SupportMessageDTO;

import com.mehmet.tepkinet.entity.Complaint;
import com.mehmet.tepkinet.entity.ComplaintStatus;
import com.mehmet.tepkinet.entity.SupportMessage;
import com.mehmet.tepkinet.entity.User;

import com.mehmet.tepkinet.exception.BadRequestException;
import com.mehmet.tepkinet.exception.ResourceNotFoundException;

import com.mehmet.tepkinet.repository.ComplaintRepository;

import com.mehmet.tepkinet.repository.SupportMessageRepository;

import com.mehmet.tepkinet.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;

import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor

public class SupportMessageService {

    private final SupportMessageRepository
            supportMessageRepository;

    private final ComplaintRepository
            complaintRepository;

    private final UserRepository
            userRepository;

    private SupportMessageDTO convertToDTO(

            SupportMessage supportMessage) {

        SupportMessageDTO dto =
                new SupportMessageDTO();

        dto.setId(
                supportMessage.getId()
        );

        dto.setMessage(
                supportMessage.getMessage()
        );

        dto.setUsername(

                supportMessage
                        .getUser()
                        .getUsername()
        );

        dto.setRole(

                supportMessage
                        .getUser()
                        .getRole()
        );

        dto.setCreatedAt(

                supportMessage
                        .getCreatedAt()
        );

        return dto;
    }


    public SupportMessageDTO createMessage(

            Long complaintId,

            SupportMessage supportMessage) {

        Authentication authentication =

                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email =
                authentication.getName();

        User currentUser =
                userRepository.findByEmail(email);

        Complaint complaint =

                complaintRepository.findById(
                                complaintId)

                        .orElseThrow(() ->

                                new ResourceNotFoundException(
                                        "Complaint bulunamadı"
                                ));

        boolean isOwner =

                complaint.getUser()
                        .getId()

                        .equals(
                                currentUser.getId()
                        );

        boolean isCompany =

                currentUser.getRole()
                        .equals("COMPANY");

        boolean sameCompany =

                currentUser.getCompany() != null

                        &&

                        complaint.getCompany()
                                .getId()

                                .equals(

                                        currentUser
                                                .getCompany()
                                                .getId()
                                );

        if (!isOwner && !(isCompany && sameCompany)) {
            throw new BadRequestException("Bu işlem için yetkiniz yok.");
        }

        if (complaint.getStatus() == ComplaintStatus.CLOSED_BY_CUSTOMER
                || complaint.getStatus() == ComplaintStatus.RESOLVED) {
            throw new BadRequestException("Bu şikayet kapatıldığı için yeni mesaj gönderemezsiniz.");
        }

        supportMessage.setUser(currentUser);
        supportMessage.setComplaint(complaint);
        supportMessage.setCreatedAt(LocalDateTime.now());

        SupportMessage savedMessage = supportMessageRepository.save(supportMessage);

        if (isCompany) {
            complaint.setStatus(ComplaintStatus.ANSWERED);
        } else {
            complaint.setStatus(ComplaintStatus.IN_REVIEW);
        }
        complaintRepository.save(complaint);

        return convertToDTO(savedMessage);
    }

    public List<SupportMessageDTO> getMessagesByComplaint(Long complaintId) {

        List<SupportMessage> messages =

                supportMessageRepository

                        .findByComplaintIdOrderByCreatedAtAsc(complaintId);

        return messages.stream()

                .map(this::convertToDTO)

                .toList();
    }

}
