package org.example.coursemanagementsystem.service;

import org.example.coursemanagementsystem.dto.CourseDto;
import org.example.coursemanagementsystem.entity.Course;
import org.example.coursemanagementsystem.entity.Section;
import org.example.coursemanagementsystem.exception.ResourceNotFoundException;
import org.example.coursemanagementsystem.repository.CourseRepository;
import org.example.coursemanagementsystem.repository.SectionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final SectionRepository sectionRepository;

    public CourseService(CourseRepository courseRepository, SectionRepository sectionRepository) {
        this.courseRepository = courseRepository;
        this.sectionRepository = sectionRepository;
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course createCourse(CourseDto courseDto) {
        Course course = new Course();
        course.setCode(courseDto.getCode());
        course.setTitle(courseDto.getTitle());
        course.setCredits(courseDto.getCredits());

        return courseRepository.save(course);
    }

    public Course getCourseById(int id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id " + id));
    }

    public Course updateCourse(int id, CourseDto dto) {
        Course course = getCourseById(id);

        course.setCode(dto.getCode());
        course.setTitle(dto.getTitle());
        course.setCredits(dto.getCredits());

        return courseRepository.save(course);
    }

    public void deleteCourse(int id) {
        courseRepository.delete(getCourseById(id));
    }

    // Fonctionnalite metier : sections de ce cours, a travers TOUTES ses offres
    // actives (ActiveCourse). Avant la refacto, Section pointait directement
    // vers Course ; maintenant il faut traverser Section -> ActiveCourse -> Course.
    public List<Section> getSectionsForCourse(int courseId) {
        getCourseById(courseId); // 404 si le cours n'existe pas
        return sectionRepository.findByActiveCourse_Course_Id(courseId);
    }
}
