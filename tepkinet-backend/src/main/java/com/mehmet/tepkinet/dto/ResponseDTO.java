package com.mehmet.tepkinet.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ResponseDTO {

    private Long id;

    private String content;

    private LocalDateTime createdAt;

    private String username;

    private Long complaintId;
}