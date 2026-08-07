package org.example.coursemanagementsystem.controller;

import jakarta.validation.Valid;
import org.example.coursemanagementsystem.dto.StudyProgramDto;
import org.example.coursemanagementsystem.entity.StudyProgram;
import org.example.coursemanagementsystem.service.StudyProgramService;
import org.springframework.web.bind.annotation.*;
import org.example.coursemanagementsystem.dto.ActiveCourseSummaryDto;
import java.util.List;


@RestController
@RequestMapping("/study-programs")
public class StudyProgramController {

    private final StudyProgramService studyProgramService;

    public StudyProgramController(StudyProgramService studyProgramService) {
        this.studyProgramService = studyProgramService;
    }

    @GetMapping
    public List<StudyProgram> getAllStudyPrograms() {
        return studyProgramService.getAllStudyPrograms();
    }

    @PostMapping
    public StudyProgram createStudyProgram(@Valid @RequestBody StudyProgramDto dto) {
        return studyProgramService.createStudyProgram(dto);
    }
    @GetMapping("/{id}")
    public StudyProgram getStudyProgramById(@PathVariable int id) {
        return studyProgramService.getStudyProgramById(id);
    }

    @PutMapping("/{id}")
    public StudyProgram updateStudyProgram(@PathVariable int id, @Valid @RequestBody StudyProgramDto dto) {
        return studyProgramService.updateStudyProgram(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteStudyProgram(@PathVariable int id) {
        studyProgramService.deleteStudyProgram(id);
    }

    @GetMapping("/{id}/courses")
    public List<ActiveCourseSummaryDto> getCoursesForProgram(@PathVariable int id) {
        return studyProgramService.getCoursesForProgram(id);
    }
}
