package com.minsu.miniproject.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponse {
    private Long id;
    private String content;
    private String authorNickname;
    private Long authorId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
