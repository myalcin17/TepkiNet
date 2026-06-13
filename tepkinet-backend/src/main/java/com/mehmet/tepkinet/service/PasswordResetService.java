package com.mehmet.tepkinet.service;

import com.mehmet.tepkinet.entity.PasswordResetToken;
import com.mehmet.tepkinet.entity.User;
import com.mehmet.tepkinet.repository.PasswordResetTokenRepository;
import com.mehmet.tepkinet.repository.UserRepository;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final MailService mailService;

    public PasswordResetService(
            UserRepository userRepository,
            PasswordResetTokenRepository tokenRepository,
            MailService mailService
    ) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.mailService = mailService;
    }

    public void createResetToken(String email) {

        User user = userRepository.findByEmail(email);

        if (user == null) {
            return;
        }

        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(
                LocalDateTime.now().plusMinutes(15)
        );

        tokenRepository.save(resetToken);

        String resetLink =
                "http://localhost:5173/reset-password?token=" + token;

        mailService.sendPasswordResetMail(
                user.getEmail(),
                resetLink
        );
    }

    public void resetPassword(
        String token,
        String newPassword
) {

    PasswordResetToken resetToken =
            tokenRepository.findByToken(token)
                    .orElseThrow(() ->
                            new RuntimeException("Geçersiz bağlantı."));

    if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
        throw new RuntimeException("Bağlantının süresi dolmuş.");
    }

    User user = resetToken.getUser();

    user.setPassword(
            new BCryptPasswordEncoder().encode(newPassword)
    );

    userRepository.save(user);

    tokenRepository.delete(resetToken);
}
}