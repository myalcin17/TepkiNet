package com.mehmet.tepkinet.dto;

import com.mehmet.tepkinet.entity.ComplaintStatus;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ComplaintDTO {

    private Long id;

    private String title;

    private String content;

    private String username;

    private ComplaintStatus status;

    private String companyName;

    private LocalDateTime createdAt;
}