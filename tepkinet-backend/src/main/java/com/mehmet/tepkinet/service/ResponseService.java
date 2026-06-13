package com.mehmet.tepkinet.service;

import com.mehmet.tepkinet.dto.ResponseDTO;
import com.mehmet.tepkinet.entity.Complaint;
import com.mehmet.tepkinet.entity.Response;
import com.mehmet.tepkinet.entity.User;
import com.mehmet.tepkinet.exception.ResourceNotFoundException;
import com.mehmet.tepkinet.repository.ComplaintRepository;
import com.mehmet.tepkinet.repository.ResponseRepository;
import com.mehmet.tepkinet.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import org.springframework.security.core.Authentication;

import org.springframework.security.core.context.SecurityContextHolder;

@Service
public class ResponseService {

    private final ResponseRepository responseRepository;

    private final UserRepository userRepository;

    private final ComplaintRepository complaintRepository;

    public ResponseService(ResponseRepository responseRepository,
                           UserRepository userRepository,
                           ComplaintRepository complaintRepository) {

        this.responseRepository = responseRepository;
        this.userRepository = userRepository;
        this.complaintRepository = complaintRepository;
    }

    public ResponseDTO convertToDTO(Response response) {

        ResponseDTO dto = new ResponseDTO();

        dto.setId(response.getId());

        dto.setContent(response.getContent());

        dto.setCreatedAt(response.getCreatedAt());

        dto.setUsername(response.getUser().getUsername());

        dto.setComplaintId(response.getComplaint().getId());

        return dto;
    }

    public ResponseDTO createResponse( Long complaintId, Response response) {

        Authentication authentication =

                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email =
                authentication.getName();

        User user =
                userRepository.findByEmail(
                        email);
        if(!user.getRole().equals("COMPANY")) {

            return null;
        }

        Complaint complaint = complaintRepository.findById(complaintId)
                        .orElseThrow(() -> new ResourceNotFoundException("Complaint bulunamadı"));

        if(user.getCompany() == null) {

            return null;
        }

        if(!complaint.getCompany().getId().equals(user.getCompany().getId())) {

            return null;
        }

        response.setUser(user);

        response.setComplaint(complaint);

        Response savedResponse = responseRepository.save(response);

        return convertToDTO(savedResponse);
    }

    public List<ResponseDTO> getAllResponses() {

        List<Response> responses = responseRepository.findAll();

        List<ResponseDTO> dtoList = new ArrayList<>();

        for (Response response : responses) {

            dtoList.add(convertToDTO(response));
        }

        return dtoList;
    }

    public ResponseDTO getResponseById(Long id) {

        Response response = responseRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Response bulunamadı"));

        return convertToDTO(response);
    }

    public ResponseDTO updateResponse(Long id, Response updatedResponse) {

        Response existingResponse = responseRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Response bulunamadı"));

        existingResponse.setContent(updatedResponse.getContent());

        Response updated = responseRepository.save(existingResponse);

        return convertToDTO(updated);
    }

    public void deleteResponse(Long id) {

        responseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Response bulunamadı"));

        responseRepository.deleteById(id);
    }

    public List<ResponseDTO> getResponsesByComplaintId(Long complaintId) {

        List<Response> responses = responseRepository.findByComplaintId(complaintId);

        List<ResponseDTO> dtoList = new ArrayList<>();

        for (Response response : responses) {

            dtoList.add(convertToDTO(response));
        }

        return dtoList;
    }

    public List<ResponseDTO> getResponsesByUserId(Long userId) {

        List<Response> responses = responseRepository.findByUserId(userId);

        List<ResponseDTO> dtoList = new ArrayList<>();

        for (Response response : responses) {

            dtoList.add(convertToDTO(response));
        }

        return dtoList;
    }
}