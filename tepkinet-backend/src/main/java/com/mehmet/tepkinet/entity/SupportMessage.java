package com.mehmet.tepkinet.entity;

import jakarta.persistence.*;

import lombok.Getter;

import lombok.NoArgsConstructor;

import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "support_messages")

@Getter
@Setter
@NoArgsConstructor

public class SupportMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    private String message;

    private LocalDateTime createdAt;

    @ManyToOne

    @JoinColumn(name = "user_id")

    private User user;

    @ManyToOne

    @JoinColumn(name = "complaint_id")

    private Complaint complaint;
}