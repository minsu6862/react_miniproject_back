package com.minsu.miniproject.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class WebController {

    // React Router 지원: React 라우터 경로를 index.html로 포워딩
    @GetMapping(value = {
        "/",
        "/login",
        "/signup",
        "/board",
        "/board/write",
        "/board/{id}",
        "/board/{id}/edit"
    })
    public String forward() {
        return "forward:/index.html";
    }
}