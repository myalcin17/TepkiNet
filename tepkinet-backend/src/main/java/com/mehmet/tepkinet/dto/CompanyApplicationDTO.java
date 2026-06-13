package com.mehmet.tepkinet.dto;

import com.mehmet.tepkinet.entity.CompanyApplicationStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CompanyApplicationDTO {
    private Long id;
    private String companyName;
    private String companyEmail;
    private String phone;
    private String taxOffice;
    private String taxNumber;
    private String city;
    private String district;
    private String address;
    private String authorizedPersonName;
    private String adminNotes;
    private CompanyApplicationStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime decisionAt;
}
