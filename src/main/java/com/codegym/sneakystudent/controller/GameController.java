package com.codegym.sneakystudent.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class GameController {

    /**
     * Endpoint chính hiển thị giao diện Web Minigame "Sinh Viên Lén Lút"
     */
    @GetMapping({"/", "/game"})
    public String showGame(Model model) {
        model.addAttribute("gameTitle", "Sinh Viên Lén Lút - Sneaky Student");
        model.addAttribute("targetTimeSeconds", 180); // 3 phút (180 giây)
        return "index";
    }
}
