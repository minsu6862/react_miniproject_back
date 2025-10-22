package com.minsu.miniproject.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CommentRequest {
    
    @NotBlank(message = "댓글 내용은 필수입니다")
    private String content;
}