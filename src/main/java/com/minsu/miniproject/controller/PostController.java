package com.minsu.miniproject.controller;

import com.minsu.miniproject.dto.PostRequest;
import com.minsu.miniproject.dto.PostResponse;
import com.minsu.miniproject.service.PostService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping
    public ResponseEntity<Page<PostResponse>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,  // @RequestParam 추가!
            @RequestParam(defaultValue = "10") int size) { // @RequestParam 추가!
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(postService.getAllPosts(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<PostResponse>> searchPosts(
            @RequestParam String keyword,  // @RequestParam 추가!
            @RequestParam(defaultValue = "0") int page,  // @RequestParam 추가!
            @RequestParam(defaultValue = "10") int size) { // @RequestParam 추가!
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(postService.searchPosts(keyword, pageable));
    }

    @PostMapping
    public ResponseEntity<?> createPost(
            @Valid @RequestBody PostRequest request,
            Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "로그인이 필요합니다");
                return ResponseEntity.status(401).body(error);
            }
            
            String username = authentication.getName();
            PostResponse post = postService.createPost(request, username);
            return ResponseEntity.ok(post);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody PostRequest request,
            Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "로그인이 필요합니다");
                return ResponseEntity.status(401).body(error);
            }
            
            String username = authentication.getName();
            PostResponse post = postService.updatePost(id, request, username);
            return ResponseEntity.ok(post);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "로그인이 필요합니다");
                return ResponseEntity.status(401).body(error);
            }
            
            String username = authentication.getName();
            postService.deletePost(id, username);
            Map<String, String> response = new HashMap<>();
            response.put("message", "게시글이 삭제되었습니다");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
