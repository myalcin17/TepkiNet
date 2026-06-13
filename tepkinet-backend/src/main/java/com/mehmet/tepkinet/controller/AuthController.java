package com.mehmet.tepkinet.controller;

import com.mehmet.tepkinet.dto.LoginRequestDTO;
import com.mehmet.tepkinet.dto.LoginResponseDTO;
import com.mehmet.tepkinet.dto.UserDTO;
import com.mehmet.tepkinet.entity.User;
import com.mehmet.tepkinet.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.mehmet.tepkinet.dto.ChangePasswordRequestDTO;
import com.mehmet.tepkinet.dto.ForgotPasswordRequestDTO;
import com.mehmet.tepkinet.service.PasswordResetService;
import com.mehmet.tepkinet.dto.ResetPasswordRequestDTO;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final PasswordResetService passwordResetService;

    public AuthController(UserService userService, PasswordResetService passwordResetService) {
        this.userService = userService;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/register")
    public LoginResponseDTO registerUser(@RequestBody User user) {
        String rawPassword = user.getPassword();

UserDTO userDTO = userService.createUser(user);

if (userDTO == null) {
    return null;
}

return userService.loginUser(
        user.getEmail(),
        rawPassword
);
    }

    @PostMapping("/login")
    public LoginResponseDTO loginUser(@RequestBody LoginRequestDTO request) {
        return userService.loginUser(request.getEmail(), request.getPassword());
    }

    @GetMapping("/me")
    public UserDTO getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        String email = authentication.getName();
        return userService.getUserDTOByEmail(email);
    }
    @PutMapping("/change-password")
public String changePassword(
        @RequestBody ChangePasswordRequestDTO request
) {
    Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();

    String email = authentication.getName();

    userService.changePassword(
            email,
            request.getCurrentPassword(),
            request.getNewPassword()
    );

    return "Şifre başarıyla güncellendi.";
}

@PostMapping("/forgot-password")
public String forgotPassword(
        @RequestBody ForgotPasswordRequestDTO request
) {

    passwordResetService.createResetToken(
            request.getEmail()
    );

    return "Şifre sıfırlama bağlantısı gönderildi.";
}
@PostMapping("/reset-password")
public String resetPassword(
        @RequestBody ResetPasswordRequestDTO request
) {

    passwordResetService.resetPassword(
            request.getToken(),
            request.getNewPassword()
    );

    return "Şifre başarıyla sıfırlandı.";
}
}
