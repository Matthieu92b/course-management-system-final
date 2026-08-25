package org.example.coursemanagementsystem.controller;

import jakarta.validation.Valid;
import org.example.coursemanagementsystem.dto.FacultyDto;
import org.example.coursemanagementsystem.entity.Faculty;
import org.example.coursemanagementsystem.service.FacultyService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/faculties")
public class FacultyController {

    private final FacultyService facultyService;

    public FacultyController(FacultyService facultyService) {
        this.facultyService = facultyService;
    }

    @GetMapping
    public List<Faculty> getAllFaculties() {
        return facultyService.getAllFaculties();
    }

    @PostMapping
    public Faculty createFaculty(@Valid @RequestBody FacultyDto facultyDto) {
        return facultyService.createFaculty(facultyDto);
    }
    @GetMapping("/{id}")
    public Faculty getFacultyById(@PathVariable int id) {
        return facultyService.getFacultyById(id);
    }

    @PutMapping("/{id}")
    public Faculty updateFaculty(@PathVariable int id, @Valid @RequestBody FacultyDto facultyDto) {
        return facultyService.updateFaculty(id, facultyDto);
    }

    @DeleteMapping("/{id}")
    public void deleteFaculty(@PathVariable int id) {
        facultyService.deleteFaculty(id);
    }
}
