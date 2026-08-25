package org.example.coursemanagementsystem.service;

import org.example.coursemanagementsystem.dto.ActiveCourseDto;
import org.example.coursemanagementsystem.entity.ActiveCourse;
import org.example.coursemanagementsystem.entity.Course;
import org.example.coursemanagementsystem.entity.StudyProgram;
import org.example.coursemanagementsystem.exception.ResourceNotFoundException;
import org.example.coursemanagementsystem.repository.ActiveCourseRepository;
import org.example.coursemanagementsystem.repository.CourseRepository;
import org.example.coursemanagementsystem.repository.StudyProgramRepository;
import org.springframework.stereotype.Service;

import java.time.Year;
import java.util.List;

@Service
public class ActiveCourseService {

    private final ActiveCourseRepository activeCourseRepository;
    private final StudyProgramRepository studyProgramRepository;
    private final CourseRepository courseRepository;

    public ActiveCourseService(ActiveCourseRepository activeCourseRepository,
                               StudyProgramRepository studyProgramRepository,
                               CourseRepository courseRepository) {
        this.activeCourseRepository = activeCourseRepository;
        this.studyProgramRepository = studyProgramRepository;
        this.courseRepository = courseRepository;
    }

    public List<ActiveCourse> getAllActiveCourses() {
        return activeCourseRepository.findAll();
    }

    public ActiveCourse getActiveCourseById(Integer id) {
        return activeCourseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ActiveCourse not found with id " + id));
    }

    public ActiveCourse createActiveCourse(ActiveCourseDto dto) {
        StudyProgram studyProgram = studyProgramRepository.findById(dto.getStudyProgramId())
                .orElseThrow(() -> new ResourceNotFoundException("StudyProgram not found with id " + dto.getStudyProgramId()));

        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id " + dto.getCourseId()));

        ActiveCourse activeCourse = new ActiveCourse();
        activeCourse.setStudyProgram(studyProgram);
        activeCourse.setCourse(course);
        activeCourse.setAcademicYear(Year.of(dto.getAcademicYear()));
        activeCourse.setSemester(dto.getSemester());
        activeCourse.setTypology(dto.getTypology());

        return activeCourseRepository.save(activeCourse);
    }

    public ActiveCourse updateActiveCourse(Integer id, ActiveCourseDto dto) {
        ActiveCourse activeCourse = getActiveCourseById(id);

        StudyProgram studyProgram = studyProgramRepository.findById(dto.getStudyProgramId())
                .orElseThrow(() -> new ResourceNotFoundException("StudyProgram not found with id " + dto.getStudyProgramId()));

        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id " + dto.getCourseId()));

        activeCourse.setStudyProgram(studyProgram);
        activeCourse.setCourse(course);
        activeCourse.setAcademicYear(Year.of(dto.getAcademicYear()));
        activeCourse.setSemester(dto.getSemester());
        activeCourse.setTypology(dto.getTypology());

        return activeCourseRepository.save(activeCourse);
    }

    public void deleteActiveCourse(Integer id) {
        activeCourseRepository.delete(getActiveCourseById(id));
    }
}
