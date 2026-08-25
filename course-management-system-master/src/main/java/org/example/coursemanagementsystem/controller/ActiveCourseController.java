package org.example.coursemanagementsystem.controller;

import jakarta.validation.Valid;
import org.example.coursemanagementsystem.dto.ActiveCourseDto;
import org.example.coursemanagementsystem.entity.ActiveCourse;
import org.example.coursemanagementsystem.service.ActiveCourseService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/active-courses")
public class ActiveCourseController {

    private final ActiveCourseService activeCourseService;

    public ActiveCourseController(ActiveCourseService activeCourseService) {
        this.activeCourseService = activeCourseService;
    }

    @GetMapping
    public List<ActiveCourse> getAllActiveCourses() {
        return activeCourseService.getAllActiveCourses();
    }

    // ActiveCourse a maintenant son propre id auto-genere : plus besoin
    // d'une URL a 3 segments comme avant la refacto.
    @GetMapping("/{id}")
    public ActiveCourse getActiveCourseById(@PathVariable Integer id) {
        return activeCourseService.getActiveCourseById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ActiveCourse createActiveCourse(@Valid @RequestBody ActiveCourseDto dto) {
        return activeCourseService.createActiveCourse(dto);
    }

    @PutMapping("/{id}")
    public ActiveCourse updateActiveCourse(@PathVariable Integer id, @Valid @RequestBody ActiveCourseDto dto) {
        return activeCourseService.updateActiveCourse(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteActiveCourse(@PathVariable Integer id) {
        activeCourseService.deleteActiveCourse(id);
    }
}
