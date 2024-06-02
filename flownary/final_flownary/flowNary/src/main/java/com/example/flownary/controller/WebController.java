package com.example.flownary.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class WebController {

    @RequestMapping(value = "/{path:[^\\.]*}")
    public String redirect() {
        // 모든 경로에 대해 index.html을 반환하도록 설정
        return "forward:/index.html";
    }
}