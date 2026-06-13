package com.mehmet.tepkinet.repository;

import com.mehmet.tepkinet.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment,Long>{

    List<Comment> findByComplaintId(Long complaintId);

    List<Comment> findByUserId(Long userId);
}
