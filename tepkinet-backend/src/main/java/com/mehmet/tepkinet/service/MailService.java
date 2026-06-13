package com.mehmet.tepkinet.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    private final JavaMailSender mailSender;

    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetMail(String to, String resetLink) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);
        message.setSubject("TepkiNet Şifre Sıfırlama");

        message.setText(
                "Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:\n\n"
                        + resetLink
                        + "\n\nBu bağlantı 15 dakika geçerlidir."
        );

        mailSender.send(message);
    }
}