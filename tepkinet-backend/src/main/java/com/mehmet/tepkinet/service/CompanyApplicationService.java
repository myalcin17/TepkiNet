package com.mehmet.tepkinet.service;

import com.mehmet.tepkinet.dto.CompanyApplicationDTO;
import com.mehmet.tepkinet.dto.CompanyApplicationRequestDTO;
import com.mehmet.tepkinet.entity.Company;
import com.mehmet.tepkinet.entity.CompanyApplication;
import com.mehmet.tepkinet.entity.CompanyApplicationStatus;
import com.mehmet.tepkinet.entity.User;
import com.mehmet.tepkinet.exception.BadRequestException;
import com.mehmet.tepkinet.exception.ResourceNotFoundException;
import com.mehmet.tepkinet.repository.CompanyApplicationRepository;
import com.mehmet.tepkinet.repository.CompanyRepository;
import com.mehmet.tepkinet.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class CompanyApplicationService {

    private final CompanyApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final EmailService emailService;
    private final BCryptPasswordEncoder passwordEncoder;

    public CompanyApplicationService(
            CompanyApplicationRepository applicationRepository,
            UserRepository userRepository,
            CompanyRepository companyRepository,
            BCryptPasswordEncoder passwordEncoder,
            EmailService emailService) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    public CompanyApplicationDTO convertToDTO(CompanyApplication application) {
        CompanyApplicationDTO dto = new CompanyApplicationDTO();
        dto.setId(application.getId());
        dto.setCompanyName(application.getCompanyName());
        dto.setCompanyEmail(application.getCompanyEmail());
        dto.setPhone(application.getPhone());
        dto.setTaxOffice(application.getTaxOffice());
        dto.setTaxNumber(application.getTaxNumber());
        dto.setCity(application.getCity());
        dto.setDistrict(application.getDistrict());
        dto.setAddress(application.getAddress());
        dto.setAuthorizedPersonName(application.getAuthorizedPersonName());
        dto.setAdminNotes(application.getAdminNotes());
        dto.setStatus(application.getStatus());
        dto.setCreatedAt(application.getCreatedAt());
        dto.setDecisionAt(application.getDecisionAt());
        return dto;
    }

    public CompanyApplicationDTO submitApplication(CompanyApplicationRequestDTO request) {
        if (userRepository.existsByEmail(request.getCompanyEmail())
                || applicationRepository.existsByCompanyEmail(request.getCompanyEmail())) {
            throw new BadRequestException("Bu e-posta adresi ile daha önce başvuru yapılmış veya bir kullanıcı mevcut.");
        }

        if (userRepository.existsByUsername(request.getCompanyEmail())) {
            throw new BadRequestException("Bu şirket e-postası zaten bir kullanıcı adı olarak kullanılıyor.");
        }

        if (applicationRepository.existsByPhone(request.getPhone())) {
            throw new BadRequestException("Bu telefon numarası ile zaten bir başvuru var.");
        }

        if (applicationRepository.existsByTaxNumber(request.getTaxNumber())) {
            throw new BadRequestException("Bu vergi numarası ile zaten bir başvuru var.");
        }

        CompanyApplication application = new CompanyApplication();
        application.setCompanyName(request.getCompanyName());
        application.setCompanyEmail(request.getCompanyEmail());
        application.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        application.setPhone(request.getPhone());
        application.setTaxOffice(request.getTaxOffice());
        application.setTaxNumber(request.getTaxNumber());
        application.setCity(request.getCity());
        application.setDistrict(request.getDistrict());
        application.setAddress(request.getAddress());
        application.setAuthorizedPersonName(request.getAuthorizedPersonName());
        application.setStatus(CompanyApplicationStatus.PENDING);

        CompanyApplication saved = applicationRepository.save(application);
        return convertToDTO(saved);
    }

    public List<CompanyApplicationDTO> getAllApplications() {
        List<CompanyApplication> applications = applicationRepository.findAll();
        List<CompanyApplicationDTO> dtoList = new ArrayList<>();
        for (CompanyApplication application : applications) {
            dtoList.add(convertToDTO(application));
        }
        return dtoList;
    }

    public CompanyApplicationDTO getApplicationById(Long id) {
        CompanyApplication application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company başvurusu bulunamadı"));
        return convertToDTO(application);
    }

    @Transactional
    public CompanyApplicationDTO approveApplication(Long id, String adminNotes) {
        CompanyApplication application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company başvurusu bulunamadı"));

        if (application.getStatus() != CompanyApplicationStatus.PENDING) {
            throw new BadRequestException("Sadece beklemede olan başvurular onaylanabilir.");
        }

        if (companyRepository.existsByCompanyName(application.getCompanyName())) {
            throw new BadRequestException("Bu şirket adı ile zaten kayıtlı bir şirket var.");
        }
        if (userRepository.existsByUsername(application.getCompanyEmail())) {
            throw new BadRequestException("Bu şirket e-postası zaten kullanıcı adı olarak kullanılıyor.");
        }

        Company company = new Company();
        company.setCompanyName(application.getCompanyName());
        company.setSupportEmail(application.getCompanyEmail());
        company.setVerified(true);
        company = companyRepository.save(company);

        User user = new User();
        user.setUsername(application.getCompanyEmail());
        user.setEmail(application.getCompanyEmail());
        user.setPassword(application.getPasswordHash());
        user.setRole("COMPANY");
        user.setCompany(company);
        userRepository.save(user);

        application.setStatus(CompanyApplicationStatus.APPROVED);
        application.setAdminNotes(adminNotes);
        application.setDecisionAt(java.time.LocalDateTime.now());
        CompanyApplication approved = applicationRepository.save(application);

        try {
            String subject = "Kurumsal başvurunuz onaylandı";
            String body = "Merhaba,\n\nBaşvurunuz onaylandı.\n" +
                    (adminNotes != null ? "Yönetici notu:\n" + adminNotes + "\n\n" : "") +
                    "Hesabınız oluşturuldu. Giriş için kayıtlı e-posta adresinizi kullanabilirsiniz.";
            emailService.sendSimpleMessage(application.getCompanyEmail(), subject, body);
        } catch (Exception ignored) {
        }

        return convertToDTO(approved);
    }

    public CompanyApplicationDTO rejectApplication(Long id, String adminNotes) {
        CompanyApplication application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company başvurusu bulunamadı"));

        if (application.getStatus() != CompanyApplicationStatus.PENDING) {
            throw new BadRequestException("Sadece beklemede olan başvurular reddedilebilir.");
        }

        application.setStatus(CompanyApplicationStatus.REJECTED);
        application.setAdminNotes(adminNotes);
        application.setDecisionAt(java.time.LocalDateTime.now());
        CompanyApplication rejected = applicationRepository.save(application);

        try {
            String subject = "Kurumsal başvurunuz reddedildi";
            String body = "Merhaba,\n\nBaşvurunuz incelendi ve maalesef reddedildi.\n" +
                    (adminNotes != null ? "Yönetici notu:\n" + adminNotes + "\n\n" : "") +
                    "Daha fazla bilgi için lütfen bizimle iletişime geçin.";
            emailService.sendSimpleMessage(application.getCompanyEmail(), subject, body);
        } catch (Exception ignored) {
        }

        return convertToDTO(rejected);
    }
}
