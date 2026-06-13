package com.mehmet.tepkinet.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

@Entity
@Table(name = "complaints")
@Getter
@Setter

public class Complaint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long Id;

    @NotBlank(message = "title boş olamaz")
    private String title;

    @NotBlank(message = "content boş olamaz")
    private String content;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "complaint", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments;

    @OneToMany(mappedBy = "complaint", cascade = CascadeType.ALL,

            orphanRemoval = true)
    private List<Response> responses;

    @OneToMany(mappedBy = "complaint", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SupportMessage> supportMessages;

    @ManyToOne

    @JoinColumn(name = "company_id")

    private Company company;
    @Enumerated(EnumType.STRING)

    private ComplaintStatus status;
}
