package com.mehmet.tepkinet.controller;


import com.mehmet.tepkinet.dto.CommentDTO;
import com.mehmet.tepkinet.entity.Comment;
import com.mehmet.tepkinet.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping ("/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService){
        this.commentService=commentService;
    }

    @PostMapping
    public CommentDTO createComment ( @RequestParam Long complaintId,
                                     @Valid @RequestBody Comment comment){

        return commentService.createComment( complaintId, comment);
    }

    @GetMapping
    public List<CommentDTO> getAllComments () {

        return commentService.getAllComments();
    }

    @GetMapping("/{id}")
    public CommentDTO getCommentById(@PathVariable Long id) {

        return commentService.getCommentById(id);
    }

    @PutMapping("/{id}")
    public CommentDTO updateComment(@PathVariable Long id,
                                    @Valid @RequestBody Comment updatedComment) {

        return commentService.updateComment(id, updatedComment);
    }

    @DeleteMapping("/{id}")
    public void deleteComment(@PathVariable Long id) {

        commentService.deleteComment(id);
    }

    @GetMapping("/complaint/{complaintId}")
    public List<CommentDTO> getCommentsByComplaintId (@PathVariable Long complaintId) {

        return commentService.getCommentsByComplaintId(complaintId);
    }

    @GetMapping("/user/{userId}")
    public List<CommentDTO> getCommentsByUserId (@PathVariable Long userId) {

        return commentService.getCommentsByUserId(userId);
    }
}




















