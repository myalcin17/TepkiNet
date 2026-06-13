package com.mehmet.tepkinet.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompanyApplicationRequestDTO {

    @NotBlank
    private String companyName;

    @Email
    @NotBlank
    private String companyEmail;

    @NotBlank
    private String password;

    @NotBlank
    private String phone;

    @NotBlank
    private String taxOffice;

    @NotBlank
    private String taxNumber;

    @NotBlank
    private String city;

    @NotBlank
    private String district;

    @NotBlank
    private String address;

    @NotBlank
    private String authorizedPersonName;
}
