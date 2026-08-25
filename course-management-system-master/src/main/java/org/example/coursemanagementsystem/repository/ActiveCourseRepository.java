package org.example.coursemanagementsystem.repository;

import org.example.coursemanagementsystem.entity.ActiveCourse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActiveCourseRepository extends JpaRepository<ActiveCourse, Integer> {
    List<ActiveCourse> findByStudyProgram_Id(Integer studyProgramId);
}
