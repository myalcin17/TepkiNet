package com.mehmet.tepkinet.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "companies", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"company_name"})
})
@Getter
@Setter
@NoArgsConstructor
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_name", nullable = false, unique = true)
    private String companyName;

    private String logoUrl;

    private String description;

    private String supportEmail;

    private boolean verified;

    @OneToMany(
        mappedBy = "company",
        cascade = CascadeType.ALL,
        orphanRemoval = true)
    private List<User> users;
}