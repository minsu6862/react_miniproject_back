package com.minsu.miniproject.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.minsu.miniproject.dto.PostRequest;
import com.minsu.miniproject.dto.PostResponse;
import com.minsu.miniproject.entity.Post;
import com.minsu.miniproject.entity.User;
import com.minsu.miniproject.repository.PostRepository;
import com.minsu.miniproject.repository.UserRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public Page<PostResponse> getAllPosts(Pageable pageable) {
        return postRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(this::convertToResponse);
    }

    @Transactional
    public PostResponse getPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다"));
        
        post.setViewCount(post.getViewCount() + 1);
        postRepository.save(post);
        
        return convertToResponse(post);
    }

    @Transactional
    public PostResponse createPost(PostRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));

        Post post = Post.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .user(user)
                .build();

        Post savedPost = postRepository.save(post);
        return convertToResponse(savedPost);
    }

    @Transactional
    public PostResponse updatePost(Long id, PostRequest request, String username) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다"));

        if (!post.getUser().getUsername().equals(username)) {
            throw new RuntimeException("수정 권한이 없습니다");
        }

        post.setTitle(request.getTitle());
        post.setContent(request.getContent());

        return convertToResponse(post);
    }

    @Transactional
    public void deletePost(Long id, String username) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다"));

        if (!post.getUser().getUsername().equals(username)) {
            throw new RuntimeException("삭제 권한이 없습니다");
        }

        postRepository.delete(post);
    }

    public Page<PostResponse> searchPosts(String keyword, Pageable pageable) {
        return postRepository.findByTitleContainingOrContentContaining(keyword, keyword, pageable)
                .map(this::convertToResponse);
    }

    private PostResponse convertToResponse(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .authorNickname(post.getUser().getNickname())
                .authorId(post.getUser().getId())
                .viewCount(post.getViewCount())
                .commentCount(post.getComments().size())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}
