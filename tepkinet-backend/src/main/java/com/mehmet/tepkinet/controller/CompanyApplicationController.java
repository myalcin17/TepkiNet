package com.mehmet.tepkinet.controller;

import com.mehmet.tepkinet.dto.CompanyApplicationDTO;
import com.mehmet.tepkinet.dto.CompanyApplicationRequestDTO;
import com.mehmet.tepkinet.service.CompanyApplicationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/company-applications")
public class CompanyApplicationController {

    private final CompanyApplicationService applicationService;

    public CompanyApplicationController(CompanyApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    public CompanyApplicationDTO submitApplication(
            @Valid @RequestBody CompanyApplicationRequestDTO request) {
        return applicationService.submitApplication(request);
    }
}
