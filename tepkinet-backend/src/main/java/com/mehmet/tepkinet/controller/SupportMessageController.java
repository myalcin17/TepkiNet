package com.mehmet.tepkinet.controller;

import com.mehmet.tepkinet.dto.SupportMessageDTO;

import com.mehmet.tepkinet.entity.SupportMessage;

import com.mehmet.tepkinet.service.SupportMessageService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

@RequestMapping("/support-messages")

@RequiredArgsConstructor

public class SupportMessageController {

    private final SupportMessageService
            supportMessageService;

    @PostMapping

    public SupportMessageDTO createMessage(

            @RequestParam Long complaintId,

            @RequestBody SupportMessage supportMessage) {

        return supportMessageService
                .createMessage(

                        complaintId,

                        supportMessage
                );
    }

    @GetMapping

    public List<SupportMessageDTO>

    getMessagesByComplaint(

            @RequestParam Long complaintId) {

        return supportMessageService

                .getMessagesByComplaint(
                        complaintId
                );
    }
}