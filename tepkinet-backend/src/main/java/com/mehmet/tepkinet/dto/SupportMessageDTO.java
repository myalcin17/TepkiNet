package com.mehmet.tepkinet.dto;

import lombok.Getter;

import lombok.NoArgsConstructor;

import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor

public class SupportMessageDTO {

    private Long id;

    private String message;

    private String username;

    private String role;

    private LocalDateTime createdAt;
}