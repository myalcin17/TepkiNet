package com.mehmet.tepkinet.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "company_applications", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"company_email"}),
        @UniqueConstraint(columnNames = {"phone"}),
        @UniqueConstraint(columnNames = {"tax_number"})
})
@Getter
@Setter
@NoArgsConstructor
public class CompanyApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "company_name", nullable = false)
    private String companyName;

    @NotBlank
    @Column(name = "company_email", nullable = false)
    private String companyEmail;

    @NotBlank
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @NotBlank
    @Column(nullable = false)
    private String phone;

    @NotBlank
    @Column(name = "tax_office", nullable = false)
    private String taxOffice;

    @NotBlank
    @Column(name = "tax_number", nullable = false)
    private String taxNumber;

    @NotBlank
    @Column(nullable = false)
    private String city;

    @NotBlank
    @Column(nullable = false)
    private String district;

    @NotBlank
    @Column(nullable = false)
    private String address;

    @NotBlank
    @Column(name = "authorized_person_name", nullable = false)
    private String authorizedPersonName;

    @Column(name = "admin_notes")
    private String adminNotes;

    @Column(name = "decision_at")
    private java.time.LocalDateTime decisionAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CompanyApplicationStatus status;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
