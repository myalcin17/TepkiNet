package com.mehmet.tepkinet.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger LOGGER = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    public EmailService(ObjectProvider<JavaMailSender> mailSenderProvider) {
        this.mailSender = mailSenderProvider.getIfAvailable();
        if (this.mailSender == null) {
            LOGGER.warn("JavaMailSender bean is not available. Email notifications are disabled until SMTP is configured.");
        }
    }

    public void sendSimpleMessage(String to, String subject, String text) {
        if (to == null || to.isBlank()) {
            return;
        }

        if (mailSender == null) {
            LOGGER.warn("Skipping email send because JavaMailSender is unavailable. Recipient: {}", to);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
        } catch (Exception ex) {
            LOGGER.warn("Failed to send email to {}: {}", to, ex.getMessage());
        }
    }
}
