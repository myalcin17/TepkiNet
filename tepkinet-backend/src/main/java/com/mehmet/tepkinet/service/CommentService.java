package com.mehmet.tepkinet.service;


import com.mehmet.tepkinet.dto.CommentDTO;
import com.mehmet.tepkinet.entity.Comment;
import com.mehmet.tepkinet.entity.Complaint;
import com.mehmet.tepkinet.entity.ComplaintStatus;
import com.mehmet.tepkinet.entity.User;
import com.mehmet.tepkinet.exception.BadRequestException;
import com.mehmet.tepkinet.exception.ResourceNotFoundException;
import com.mehmet.tepkinet.repository.CommentRepository;
import com.mehmet.tepkinet.repository.ComplaintRepository;
import com.mehmet.tepkinet.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.AccessDeniedException;

import org.springframework.security.core.context.SecurityContextHolder;

@Service

public class CommentService {

    private final UserRepository userRepository;
    private final ComplaintRepository complaintRepository;
    private final CommentRepository commentRepository;

    public CommentService(UserRepository userRepository, ComplaintRepository complaintRepository, CommentRepository commentRepository) {
        this.complaintRepository = complaintRepository;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
    }

    public CommentDTO convertToDTO(Comment comment) {

        CommentDTO dto = new CommentDTO();

        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());

        dto.setUsername(comment.getUser().getUsername());
        dto.setComplaintId(comment.getComplaint().getId());

        return dto;
    }


    public CommentDTO createComment(

            Long complaintId,

            Comment comment) {

        Authentication authentication =

                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email =
                authentication.getName();

        User user =
                userRepository.findByEmail(
                        email);

        Complaint complaint = complaintRepository.findById(complaintId)

                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Complaint bulunamadı"));

        if (complaint.getStatus() == ComplaintStatus.CLOSED_BY_CUSTOMER
                || complaint.getStatus() == ComplaintStatus.RESOLVED) {
            throw new BadRequestException("Bu şikayet kapatıldığı için yeni mesaj gönderemezsiniz.");
        }

        comment.setUser(user);
        comment.setComplaint(complaint);

        Comment savedComment = commentRepository.save(comment);

        return convertToDTO(savedComment);
    }

    public List<CommentDTO> getAllComments(){

        List<Comment> comments= commentRepository.findAll();  

        List<CommentDTO> dtoList = new ArrayList<>();

        for(Comment comment : comments) {
            dtoList.add(convertToDTO(comment));  
        }

        return dtoList;

    }

    public CommentDTO getCommentById(Long id){

        Comment comment = commentRepository.findById(id)

                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Comment bulunamadı"));

        return convertToDTO(comment);
    }

    public CommentDTO updateComment(Long id, Comment updatedComment){

        Comment existingComment= commentRepository.findById(id)

                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Comment bulunamadı"));

        existingComment.setContent(updatedComment.getContent());

        Comment updated= commentRepository.save(existingComment);

        return convertToDTO(updated);
    }

    public void deleteComment(Long id){
        Authentication authentication =

                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email =
                authentication.getName();

        User currentUser =
                userRepository.findByEmail(
                        email);
        Comment comment =

                commentRepository.findById(id)

                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Comment bulunamadı"
                                ));
        boolean isAdmin =

                currentUser.getRole()
                        .equals("ADMIN");

        boolean isOwner =

                comment.getUser()
                        .getId()

                        .equals(
                                currentUser.getId()
                        );

                if(!isAdmin && !isOwner) {
                        throw new AccessDeniedException("Bu işlem için yetkiniz yok.");
                }
        commentRepository.delete(
                comment);
    }


    public List<CommentDTO> getCommentsByComplaintId(Long complaintId) {

        List<Comment> comments = commentRepository.findByComplaintId(complaintId);

        List<CommentDTO> dtoList = new ArrayList<>();

        for (Comment comment : comments) {

            dtoList.add(convertToDTO(comment));
        }

        return dtoList;
    }

    public List<CommentDTO> getCommentsByUserId(Long userId) {

        List<Comment> comments = commentRepository.findByUserId(userId);

        List<CommentDTO> dtoList = new ArrayList<>();

        for(Comment comment : comments){
            dtoList.add(convertToDTO(comment));
        }

        return  dtoList;
    }

}