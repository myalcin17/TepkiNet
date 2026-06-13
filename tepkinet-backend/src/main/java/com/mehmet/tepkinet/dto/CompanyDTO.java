package com.mehmet.tepkinet.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompanyDTO {

    private Long id;

    private String companyName;

    private boolean verified;

    private String supportEmail;


    private String description;

    private long totalComplaints;

    private long pendingComplaints;

    private long openComplaints;

    private long inReviewComplaints;

    private long answeredComplaints;

    private long resolvedComplaints;
}
