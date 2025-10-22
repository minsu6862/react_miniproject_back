package com.minsu.miniproject.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.minsu.miniproject.dto.SignupRequest;
import com.minsu.miniproject.dto.UserResponse;
import com.minsu.miniproject.entity.Role;
import com.minsu.miniproject.entity.User;
import com.minsu.miniproject.repository.UserRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserResponse signup(SignupRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("이미 존재하는 아이디입니다");
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("이미 존재하는 이메일입니다");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .nickname(request.getNickname())
                .email(request.getEmail())
                .university(request.getUniversity())
                .role(Role.ROLE_USER)
                .build();

        User savedUser = userRepository.save(user);
        
        return convertToResponse(savedUser);
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
        return convertToResponse(user);
    }

    private UserResponse convertToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .nickname(user.getNickname())
                .email(user.getEmail())
                .university(user.getUniversity())
                .createdAt(user.getCreatedAt())
                .build();
    }
    
    // UserService.java
    public UserResponse getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
        
        return UserResponse.builder()
            .id(user.getId())
            .username(user.getUsername())
            .nickname(user.getNickname())
            .email(user.getEmail())
            .createdAt(user.getCreatedAt())
            .build();
    }
}