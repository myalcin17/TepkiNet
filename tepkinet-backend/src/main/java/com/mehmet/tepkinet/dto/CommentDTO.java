package com.mehmet.tepkinet.dto;

import lombok.Setter;
import lombok.Getter;
import java.time.LocalDateTime;
@Getter
@Setter

public class CommentDTO {

    private Long Id;
    private String content;
    private String username;
    private LocalDateTime createdAt;
    private Long complaintId;



}
