package com.mehmet.tepkinet.controller;

import com.mehmet.tepkinet.dto.CompanyApplicationDTO;
import com.mehmet.tepkinet.repository.ComplaintRepository;
import com.mehmet.tepkinet.repository.UserRepository;
import com.mehmet.tepkinet.service.CompanyApplicationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.mehmet.tepkinet.dto.AdminDashboardDTO;
import com.mehmet.tepkinet.entity.ComplaintStatus;
import com.mehmet.tepkinet.dto.UserDTO;
import com.mehmet.tepkinet.service.UserService;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final CompanyApplicationService applicationService;
    private final com.mehmet.tepkinet.service.CompanyService companyService;
    private final UserRepository userRepository;
    private final ComplaintRepository complaintRepository;
    private final UserService userService;

    public AdminController(CompanyApplicationService applicationService, com.mehmet.tepkinet.service.CompanyService companyService, UserRepository userRepository, ComplaintRepository complaintRepository, UserService userService) {
        this.applicationService = applicationService;
        this.companyService = companyService;
        this.userRepository = userRepository;
        this.complaintRepository = complaintRepository;
        this.userService = userService;
    }

    @GetMapping("/test")
    public String adminTest() {
        return "Admin paneli";
    }

    @GetMapping("/company-applications")
    public List<CompanyApplicationDTO> getAllCompanyApplications() {
        return applicationService.getAllApplications();
    }

    @GetMapping("/company-applications/{id}")
    public CompanyApplicationDTO getCompanyApplicationById(@PathVariable Long id) {
        return applicationService.getApplicationById(id);
    }

    @PostMapping("/company-applications/{id}/approve")
    public CompanyApplicationDTO approveApplication(
            @PathVariable Long id,
            @RequestBody(required = false) CompanyApplicationDTO request) {
        String adminNotes = request != null ? request.getAdminNotes() : null;
        return applicationService.approveApplication(id, adminNotes);
    }

    @PostMapping("/company-applications/{id}/reject")
    public CompanyApplicationDTO rejectApplication(
            @PathVariable Long id,
            @RequestBody(required = false) CompanyApplicationDTO request) {
        String adminNotes = request != null ? request.getAdminNotes() : null;
        return applicationService.rejectApplication(id, adminNotes);
    }

    @GetMapping("/companies")
    public List<com.mehmet.tepkinet.dto.CompanyDTO> getAllCompaniesAdmin() {
        return companyService.getAllCompaniesAdmin();
    }
    @GetMapping("/dashboard")
public AdminDashboardDTO getDashboard() {

    AdminDashboardDTO dto = new AdminDashboardDTO();

    dto.setTotalUsers(
            userRepository.count()
    );

    dto.setTotalCompanies(
            companyService.getAllCompaniesAdmin().size()
    );

    dto.setTotalComplaints(
            complaintRepository.count()
    );

    dto.setResolvedComplaints(
            complaintRepository
                    .findByStatus(ComplaintStatus.RESOLVED)
                    .size()
    );

    return dto;
}

@GetMapping("/users")
public List<UserDTO> getAllUsers() {

    return userService.getAllUserDTOs();

}

}