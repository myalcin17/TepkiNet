package com.mehmet.tepkinet.service;

import com.mehmet.tepkinet.dto.CompanyDTO;
import com.mehmet.tepkinet.entity.Company;
import com.mehmet.tepkinet.exception.ResourceNotFoundException;
import com.mehmet.tepkinet.repository.CompanyRepository;
import org.springframework.stereotype.Service;
import com.mehmet.tepkinet.entity.Complaint;
import com.mehmet.tepkinet.entity.ComplaintStatus;
import com.mehmet.tepkinet.repository.ComplaintRepository;
import java.util.ArrayList;
import java.util.List;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final ComplaintRepository complaintRepository;
    

    public CompanyService(CompanyRepository companyRepository, ComplaintRepository complaintRepository) {
        this.companyRepository = companyRepository;
        this.complaintRepository = complaintRepository;
    }

    public CompanyDTO convertToDTO(Company company) {
        CompanyDTO dto = new CompanyDTO();
        dto.setId(company.getId());
        dto.setCompanyName(company.getCompanyName());
        dto.setVerified(company.isVerified());
        dto.setSupportEmail(company.getSupportEmail());
        dto.setDescription(company.getDescription());

        List<Complaint> complaints =
        complaintRepository.findByCompanyId(company.getId());

dto.setTotalComplaints(
        complaints.size()
);

dto.setPendingComplaints(
        complaints.stream()
                .filter(c -> c.getStatus() == ComplaintStatus.PENDING)
                .count()
);

dto.setOpenComplaints(
        complaints.stream()
                .filter(c -> c.getStatus() == ComplaintStatus.OPEN)
                .count()
);

dto.setInReviewComplaints(
        complaints.stream()
                .filter(c -> c.getStatus() == ComplaintStatus.IN_REVIEW)
                .count()
);

dto.setAnsweredComplaints(
        complaints.stream()
                .filter(c -> c.getStatus() == ComplaintStatus.ANSWERED)
                .count()
);

dto.setResolvedComplaints(
        complaints.stream()
                .filter(c -> c.getStatus() == ComplaintStatus.RESOLVED)
                .count()
);
        return dto;
    }

    public List<CompanyDTO> getAllCompanies() {
        List<Company> companies = companyRepository.findAllByVerifiedTrue();
        List<CompanyDTO> dtoList = new ArrayList<>();

        for (Company company : companies) {
            dtoList.add(convertToDTO(company));
        }

        return dtoList;
    }

    public List<CompanyDTO> getAllCompaniesAdmin() {
        List<Company> companies = companyRepository.findAll();
        List<CompanyDTO> dtoList = new ArrayList<>();

        for (Company company : companies) {
            dtoList.add(convertToDTO(company));
        }

        dtoList.sort((a, b) -> a.getCompanyName().compareToIgnoreCase(b.getCompanyName()));

        return dtoList;
    }

    public CompanyDTO getCompanyById(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company bulunamadı"));

        return convertToDTO(company);
    }

    public CompanyDTO getCompanyByUserEmail(String email) {

    Company company = companyRepository
            .findByUsersEmail(email)
            .orElseThrow(() ->
                    new ResourceNotFoundException("Şirket bulunamadı"));

    return convertToDTO(company);
}

public void deleteCompany(Long id) {

    Company company = companyRepository.findById(id)
            .orElseThrow(() ->
                    new ResourceNotFoundException("Şirket bulunamadı"));

    companyRepository.delete(company);
}
}
