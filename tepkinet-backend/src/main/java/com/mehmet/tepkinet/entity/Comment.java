package com.mehmet.tepkinet.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table (name = "comments")
@Getter
@Setter

public class Comment {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)

    private Long Id;
    private String content;

    @CreationTimestamp
    private LocalDateTime createdAt;


    @ManyToOne
    @JoinColumn (name="user_id" )
    private User user;

    @ManyToOne
    @JoinColumn (name= "complaint_id")
    private Complaint complaint;
}
