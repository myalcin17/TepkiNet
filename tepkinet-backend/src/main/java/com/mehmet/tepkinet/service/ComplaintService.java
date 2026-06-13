package com.mehmet.tepkinet.service;

import com.mehmet.tepkinet.dto.ComplaintDTO;
import com.mehmet.tepkinet.entity.*;
import com.mehmet.tepkinet.exception.BadRequestException;
import com.mehmet.tepkinet.exception.ResourceNotFoundException;
import com.mehmet.tepkinet.repository.CompanyRepository;
import com.mehmet.tepkinet.repository.ComplaintRepository;
import com.mehmet.tepkinet.repository.SupportMessageRepository;
import com.mehmet.tepkinet.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final SupportMessageRepository supportMessageRepository;

    public ComplaintService(ComplaintRepository complaintRepository, UserRepository userRepository,
                            CompanyRepository companyRepository,
                            SupportMessageRepository supportMessageRepository) {
        this.complaintRepository = complaintRepository;
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.supportMessageRepository = supportMessageRepository;
    }

    public ComplaintDTO convertToDTO(Complaint complaint) {
        ComplaintDTO dto = new ComplaintDTO();
        if (complaint == null) {
            return dto;
        }

        dto.setId(complaint.getId());
        dto.setTitle(complaint.getTitle());
        dto.setContent(complaint.getContent());
        dto.setStatus(complaint.getStatus());
        dto.setCreatedAt(complaint.getCreatedAt());

        if (complaint.getCompany() != null) {
            dto.setCompanyName(complaint.getCompany().getCompanyName());
        }

        if (complaint.getUser() != null) {
            dto.setUsername(complaint.getUser().getUsername());
        }


        return dto;
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            throw new BadRequestException("Bu işlem için giriş yapmalısınız.");
        }

        User currentUser = userRepository.findByEmail(authentication.getName());
        if (currentUser == null) {
            throw new BadRequestException("Bu işlem için giriş yapmalısınız.");
        }

        return currentUser;
    }

    private User getAuthenticatedUserOrNull() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return null;
        }

        return userRepository.findByEmail(authentication.getName());
    }

    private Complaint refreshComplaintStatusIfStale(Complaint complaint) {
        if (complaint == null) {
            return complaint;
        }

        if (complaint.getStatus() == ComplaintStatus.CLOSED_BY_CUSTOMER || complaint.getStatus() == ComplaintStatus.RESOLVED) {
            return complaint;
        }

        List<SupportMessage> messages = supportMessageRepository.findByComplaintIdOrderByCreatedAtAsc(complaint.getId());
        if (messages.isEmpty()) {
            return complaint;
        }

        SupportMessage lastMessage = messages.get(messages.size() - 1);
        if (lastMessage.getUser() == null || !"COMPANY".equals(lastMessage.getUser().getRole())) {
            return complaint;
        }

        if (lastMessage.getCreatedAt().isBefore(LocalDateTime.now().minusHours(48))) {
            complaint.setStatus(ComplaintStatus.CLOSED_BY_CUSTOMER);
            complaintRepository.save(complaint);
        }

        return complaint;
    }

    private Complaint maybeUpdateStatusForCompanyView(Complaint complaint, User currentUser) {
        if (complaint == null || currentUser == null || currentUser.getCompany() == null || complaint.getCompany() == null) {
            return complaint;
        }

        boolean isCompany = "COMPANY".equals(currentUser.getRole());
        boolean sameCompany = complaint.getCompany().getId() != null
                && currentUser.getCompany().getId() != null
                && complaint.getCompany().getId().equals(currentUser.getCompany().getId());

        if (isCompany && sameCompany
                && (complaint.getStatus() == ComplaintStatus.PENDING || complaint.getStatus() == ComplaintStatus.OPEN)) {
            complaint.setStatus(ComplaintStatus.IN_REVIEW);
            complaintRepository.save(complaint);
        }

        return complaint;
    }

    public ComplaintDTO createComplaint(Long companyId, Complaint complaint) {
        if (complaint == null) {
            throw new BadRequestException("Geçersiz şikayet verisi.");
        }

        User user = getCurrentUser();

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company bulunamadı"));

        if (!company.isVerified()) {
            throw new BadRequestException("Sadece onaylanmış şirketler seçilebilir.");
        }

        complaint.setUser(user);
        complaint.setCompany(company);
        complaint.setStatus(ComplaintStatus.PENDING);

        Complaint savedComplaint = complaintRepository.save(complaint);

        return convertToDTO(savedComplaint);
    }

    public List<ComplaintDTO> getAllComplaints() {
        List<Complaint> complaints = complaintRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));

        List<ComplaintDTO> dtoList = new ArrayList<>();

        for (Complaint complaint : complaints) {
            complaint = refreshComplaintStatusIfStale(complaint);
            dtoList.add(convertToDTO(complaint));
        }

        return dtoList;
    }

    public ComplaintDTO getComplaintById(Long id) {

        Complaint complaint = complaintRepository.findById(id)

                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Complaint bulunamadı"));

        User currentUser = getAuthenticatedUserOrNull();
        if (currentUser != null) {
            complaint = maybeUpdateStatusForCompanyView(complaint, currentUser);
        }
        complaint = refreshComplaintStatusIfStale(complaint);

        return convertToDTO(complaint);
    }

    public ComplaintDTO updateComplaint(Long id, Complaint updatedComplaint) {

        Complaint existingComplaint =
                complaintRepository.findById(id)

                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Complaint bulunamadı"));

        existingComplaint.setTitle(
                updatedComplaint.getTitle());

        existingComplaint.setContent(
                updatedComplaint.getContent());

        Complaint updated = complaintRepository.save(existingComplaint);

        return convertToDTO(updated);
    }



public void deleteComplaint(Long id) {
        User currentUser = getCurrentUser();

        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint bulunamadı"));

        boolean isAdmin = "ADMIN".equals(currentUser.getRole());
        boolean isOwner = complaint.getUser() != null
                && complaint.getUser().getId() != null
                && complaint.getUser().getId().equals(currentUser.getId());

        if (!isAdmin && !isOwner) {
            throw new AccessDeniedException("Bu işlem için yetkiniz yok.");
        }

        complaintRepository.delete(complaint);
    }

public List<ComplaintDTO> getComplaintsByUserId(Long userId) {

        List<Complaint> complaints = complaintRepository.findByUserId(userId);

        List<ComplaintDTO> dtoList = new ArrayList<>();

        for (Complaint complaint : complaints) {
            complaint = refreshComplaintStatusIfStale(complaint);
            dtoList.add(convertToDTO(complaint));
        }

        return dtoList;
    }

    public List<ComplaintDTO> getComplaintsByStatus(ComplaintStatus status) {
        List<Complaint> complaints = complaintRepository.findByStatus(status);

        List<ComplaintDTO> dtoList = new ArrayList<>();

        for (Complaint complaint : complaints) {
            complaint = refreshComplaintStatusIfStale(complaint);
            dtoList.add(convertToDTO(complaint));
        }

        return dtoList;
    }

    public List<ComplaintDTO> searchComplaints(
            String keyword) {
    if (keyword == null || keyword.isBlank()) {
        return getAllComplaints();
    }

    List<Complaint> complaints = complaintRepository.findByTitleContainingIgnoreCase(keyword);
    List<ComplaintDTO> dtoList = new ArrayList<>();

    for (Complaint complaint : complaints) {
        dtoList.add(convertToDTO(complaint));
    }

    return dtoList;
}

public List<ComplaintDTO> getLatestComplaints() {

    List<Complaint> complaints =
            complaintRepository
                    .findAllByOrderByCreatedAtDesc();

    List<ComplaintDTO> dtoList =
            new ArrayList<>();

    for (Complaint complaint : complaints) {

        dtoList.add(convertToDTO(complaint));
    }

    return dtoList;
}

public Page<ComplaintDTO> getComplaintsWithPagination(
        int page,
        int size) {
    if (page < 0 || size <= 0) {
        throw new IllegalArgumentException("Sayfa numarası veya sayfa boyutu geçersiz.");
    }

    Pageable pageable = PageRequest.of(page, size);
    Page<Complaint> complaints = complaintRepository.findAll(pageable);

    return complaints.map(this::convertToDTO);
}

public List<ComplaintDTO> getComplaintsSorted() {

    List<Complaint> complaints =
            complaintRepository.findAll(
                    Sort.by("title"));

    List<ComplaintDTO> dtoList =
            new ArrayList<>();

    for (Complaint complaint : complaints) {

        dtoList.add(convertToDTO(complaint));
    }

    return dtoList;
}

    public ComplaintDTO updateStatus(
            Long complaintId,
            ComplaintStatus status) {
        User currentUser = getCurrentUser();

        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint bulunamadı"));

        boolean isCompany = "COMPANY".equals(currentUser.getRole());
        boolean sameCompany = currentUser.getCompany() != null
                && complaint.getCompany() != null
                && complaint.getCompany().getId() != null
                && complaint.getCompany().getId().equals(currentUser.getCompany().getId());

        boolean isOwner = complaint.getUser() != null
                && complaint.getUser().getId() != null
                && complaint.getUser().getId().equals(currentUser.getId());

        if (complaint.getStatus() == ComplaintStatus.CLOSED_BY_CUSTOMER
                || complaint.getStatus() == ComplaintStatus.RESOLVED) {
            throw new BadRequestException("Bu şikayet kapatıldığı için durum güncellenemez.");
        }

        if (status == ComplaintStatus.RESOLVED) {
            if (!isOwner) {
                throw new AccessDeniedException("Bu işlem için yetkiniz yok.");
            }
        } else {
            if (!(isCompany && sameCompany)) {
                throw new AccessDeniedException("Bu işlem için yetkiniz yok.");
            }
        }

        complaint.setStatus(status);
        Complaint savedComplaint = complaintRepository.save(complaint);

        return convertToDTO(savedComplaint);
    }

    public ComplaintDTO closeComplaint(Long complaintId) {
        User currentUser = getCurrentUser();

        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint bulunamadı"));

        boolean isOwner = complaint.getUser() != null
                && complaint.getUser().getId() != null
                && complaint.getUser().getId().equals(currentUser.getId());

        if (!isOwner) {
            throw new AccessDeniedException("Bu işlemi sadece şikayeti oluşturan kullanıcı yapabilir.");
        }

        complaint.setStatus(ComplaintStatus.CLOSED_BY_CUSTOMER);
        Complaint saved = complaintRepository.save(complaint);

        return convertToDTO(saved);
    }

    public List<ComplaintDTO> getMyComplaints() {
        User currentUser = getCurrentUser();

        List<Complaint> complaints = complaintRepository.findByUserId(currentUser.getId());
        List<ComplaintDTO> dtoList = new ArrayList<>();

        for (Complaint complaint : complaints) {
            complaint = refreshComplaintStatusIfStale(complaint);
            dtoList.add(convertToDTO(complaint));
        }

        return dtoList;
    }

    public List<ComplaintDTO> getCompanyComplaints() {
        User currentUser = getCurrentUser();

        if (currentUser.getCompany() == null || currentUser.getCompany().getId() == null) {
            return new ArrayList<>();
        }

        List<Complaint> complaints = complaintRepository.findByCompanyIdOrderByCreatedAtDesc(currentUser.getCompany().getId());
        List<ComplaintDTO> dtoList = new ArrayList<>();

        for (Complaint complaint : complaints) {
            complaint = refreshComplaintStatusIfStale(complaint);
            dtoList.add(convertToDTO(complaint));
        }

        return dtoList;
    }

}

