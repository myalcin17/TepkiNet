package com.mehmet.tepkinet.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class UserDTO {

    private Long id;

    private String username;

    private String email;

    private String role;

    private LocalDateTime createdAt;
    
    private int complaintCount;
}