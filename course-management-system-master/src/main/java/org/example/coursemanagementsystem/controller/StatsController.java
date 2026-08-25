package org.example.coursemanagementsystem.controller;

import org.example.coursemanagementsystem.dto.ProgramCourseCountDto;
import org.example.coursemanagementsystem.dto.SectionTypeCountDto;
import org.example.coursemanagementsystem.dto.TeachingLoadDto;
import org.example.coursemanagementsystem.service.StatsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/stats")
public class StatsController {

    private final StatsService statsService;

    public StatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    // Charge d'enseignement de tous les enseignants (bar chart).
    @GetMapping("/teaching-load")
    public List<TeachingLoadDto> getTeachingLoadStats() {
        return statsService.getTeachingLoadStats();
    }

    // Nombre de cours actifs par programme (bar chart).
    @GetMapping("/courses-per-program")
    public List<ProgramCourseCountDto> getCoursesPerProgramStats() {
        return statsService.getCoursesPerProgramStats();
    }

    // Repartition des sections par type (pie chart).
    @GetMapping("/sections-per-type")
    public List<SectionTypeCountDto> getSectionsPerTypeStats() {
        return statsService.getSectionsPerTypeStats();
    }
}
