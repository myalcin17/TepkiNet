package com.mehmet.tepkinet.controller;

import com.mehmet.tepkinet.dto.ResponseDTO;
import com.mehmet.tepkinet.entity.Response;
import com.mehmet.tepkinet.service.ResponseService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/responses")
public class ResponseController {

    private final ResponseService responseService;

    public ResponseController(ResponseService responseService) {

        this.responseService = responseService;
    }

    @PostMapping
    public ResponseDTO createResponse(@RequestParam Long complaintId,
                                      @Valid @RequestBody Response response) {

        return responseService.createResponse(complaintId, response);
    }

    @GetMapping
    public List<ResponseDTO> getAllResponses() {

        return responseService.getAllResponses();
    }

    @GetMapping("/{id}")
    public ResponseDTO getResponseById(@PathVariable Long id) {

        return responseService.getResponseById(id);
    }

    @PutMapping("/{id}")
    public ResponseDTO updateResponse(@PathVariable Long id,
                                      @Valid @RequestBody Response updatedResponse) {

        return responseService.updateResponse(id, updatedResponse);
    }

    @DeleteMapping("/{id}")
    public void deleteResponse(@PathVariable Long id) {

        responseService.deleteResponse(id);
    }

    @GetMapping("/complaint/{complaintId}")
    public List<ResponseDTO> getResponsesByComplaintId(@PathVariable Long complaintId) {

        return responseService.getResponsesByComplaintId(complaintId);
    }

    @GetMapping("/user/{userId}")
    public List<ResponseDTO> getResponsesByUserId(@PathVariable Long userId) {

        return responseService.getResponsesByUserId(userId);
    }
}

