package com.mehmet.tepkinet.controller;

import com.mehmet.tepkinet.entity.Complaint;
import com.mehmet.tepkinet.entity.ComplaintStatus;
import com.mehmet.tepkinet.service.ComplaintService;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;

import java.util.List;

import jakarta.validation.Valid;
import com.mehmet.tepkinet.dto.ComplaintDTO;

@RestController
@RequestMapping("/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @PostMapping
    public ComplaintDTO createComplaint( @RequestParam Long companyId,
                                        @Valid @RequestBody Complaint complaint) {


        return complaintService.createComplaint(companyId, complaint);
    }

    @GetMapping
    public List<ComplaintDTO> getAllComplaints() {
        return complaintService.getAllComplaints();
    }

    @GetMapping("/{id}") 
    public ComplaintDTO getComplaintById(@PathVariable Long id) {
        return complaintService.getComplaintById(id);
    }

    @PutMapping("/{id}")      
    public ComplaintDTO updateComplaint(@PathVariable Long id, @Valid @RequestBody Complaint updatedComplaint) {
        return complaintService.updateComplaint(id, updatedComplaint);
    }

    @DeleteMapping("/{id}")
    public void deleteComplaint(@PathVariable Long id) {
        complaintService.deleteComplaint(id);
    }

    @GetMapping("/user/{userId}")
    public List<ComplaintDTO> getComplaintsByUserId(@PathVariable Long userId) {

        return complaintService.getComplaintsByUserId(userId);

    }

    @GetMapping("/status/{status}")
    public List<ComplaintDTO> getComplaintsByStatus(@PathVariable ComplaintStatus status) {

        return complaintService.getComplaintsByStatus(status);
    }

    @GetMapping("/search")
    public List<ComplaintDTO> searchComplaints(@RequestParam String keyword) {

        return complaintService.searchComplaints(keyword);
    }

    @GetMapping("/latest")
    public List<ComplaintDTO> getLatestComplaints() {

        return complaintService.getLatestComplaints();
    }

    @GetMapping("/pagination")
    public Page<ComplaintDTO> getComplaintsWithPagination(

            @RequestParam int page, @RequestParam int size) {

        return complaintService.getComplaintsWithPagination(page, size);
    }

    @GetMapping("/sorted")
    public List<ComplaintDTO> getComplaintsSorted() {

        return complaintService.getComplaintsSorted();
    }

    @PatchMapping("/{id}/status")

    public ComplaintDTO updateStatus(

            @PathVariable Long id,

            @RequestParam ComplaintStatus status) {

        return complaintService
                .updateStatus(
                        id,
                        status
                );
    }

    @PostMapping("/{id}/close")
    public ComplaintDTO closeComplaint(@PathVariable Long id) {
        return complaintService.closeComplaint(id);
    }

    @GetMapping("/my-complaints")

    public List<ComplaintDTO>
    getMyComplaints() {

        return complaintService
                .getMyComplaints();
    }

    @GetMapping("/company")

    public List<ComplaintDTO>
    getCompanyComplaints() {

        return complaintService
                .getCompanyComplaints();
    }

}