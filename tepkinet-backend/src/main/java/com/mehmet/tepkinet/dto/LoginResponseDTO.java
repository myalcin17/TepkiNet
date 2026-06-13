package com.mehmet.tepkinet.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponseDTO {

    private String token;

    private UserDTO user;
}