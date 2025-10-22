package com.minsu.miniproject.controller;

import com.minsu.miniproject.dto.CommentRequest;
import com.minsu.miniproject.dto.CommentResponse;
import com.minsu.miniproject.service.CommentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentResponse>> getCommentsByPostId(
            @PathVariable(name = "postId") Long postId) {
        return ResponseEntity.ok(commentService.getCommentsByPostId(postId));
    }

    @PostMapping("/post/{postId}")
    public ResponseEntity<?> createComment(
            @PathVariable(name = "postId") Long postId,
            @Valid @RequestBody CommentRequest request,
            Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "로그인이 필요합니다");
                return ResponseEntity.status(401).body(error);
            }

            String username = authentication.getName();
            CommentResponse comment = commentService.createComment(postId, request, username);
            return ResponseEntity.ok(comment);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateComment(
            @PathVariable(name = "id") Long id,
            @Valid @RequestBody CommentRequest request,
            Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "로그인이 필요합니다");
                return ResponseEntity.status(401).body(error);
            }

            String username = authentication.getName();
            CommentResponse comment = commentService.updateComment(id, request, username);
            return ResponseEntity.ok(comment);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(
            @PathVariable(name = "id") Long id,
            Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "로그인이 필요합니다");
                return ResponseEntity.status(401).body(error);
            }

            String username = authentication.getName();
            commentService.deleteComment(id, username);
            Map<String, String> response = new HashMap<>();
            response.put("message", "댓글이 삭제되었습니다");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}