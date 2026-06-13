package com.mehmet.tepkinet.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminDashboardDTO {

    private long totalUsers;

    private long totalCompanies;

    private long totalComplaints;

    private long resolvedComplaints;
}