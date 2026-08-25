package org.example.coursemanagementsystem.controller;

import org.example.coursemanagementsystem.dto.ProgramCourseCountDto;
import org.example.coursemanagementsystem.dto.SectionTypeCountDto;
import org.example.coursemanagementsystem.dto.TeachingLoadDto;
import org.example.coursemanagementsystem.service.StatsService;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
    // academicYear/semester optionnels : filtre le dashboard sur une periode.
    @GetMapping("/teaching-load")
    public List<TeachingLoadDto> getTeachingLoadStats(@RequestParam(required = false) Integer academicYear,
                                                        @RequestParam(required = false) Integer semester) {
        return statsService.getTeachingLoadStats(academicYear, semester);
    }

    // Nombre de cours actifs par programme (bar chart).
    @GetMapping("/courses-per-program")
    public List<ProgramCourseCountDto> getCoursesPerProgramStats(@RequestParam(required = false) Integer academicYear,
                                                                   @RequestParam(required = false) Integer semester) {
        return statsService.getCoursesPerProgramStats(academicYear, semester);
    }

    // Repartition des sections par type (pie chart).
    @GetMapping("/sections-per-type")
    public List<SectionTypeCountDto> getSectionsPerTypeStats(@RequestParam(required = false) Integer academicYear,
                                                               @RequestParam(required = false) Integer semester) {
        return statsService.getSectionsPerTypeStats(academicYear, semester);
    }

    // Annees academiques disponibles, pour peupler les filtres du dashboard.
    @GetMapping("/academic-years")
    public List<Integer> getAcademicYears() {
        return statsService.getDistinctAcademicYears();
    }

    @GetMapping("/teaching-load/export")
    public ResponseEntity<byte[]> exportTeachingLoad(@RequestParam(required = false) Integer academicYear,
                                                       @RequestParam(required = false) Integer semester) {
        return csvResponse(statsService.exportTeachingLoadCsv(academicYear, semester), "teaching-load.csv");
    }

    @GetMapping("/courses-per-program/export")
    public ResponseEntity<byte[]> exportCoursesPerProgram(@RequestParam(required = false) Integer academicYear,
                                                            @RequestParam(required = false) Integer semester) {
        return csvResponse(statsService.exportCoursesPerProgramCsv(academicYear, semester), "courses-per-program.csv");
    }

    private ResponseEntity<byte[]> csvResponse(byte[] csv, String filename) {
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("text/csv"))
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(filename).build().toString())
                .body(csv);
    }
}
