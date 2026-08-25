package org.example.coursemanagementsystem.repository;

import org.example.coursemanagementsystem.entity.Section;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SectionRepository extends JpaRepository<Section, Long> {
    // sections d'une offre de cours precise (ActiveCourse)
    List<Section> findByActiveCourse_Id(Integer activeCourseId);

    // sections a travers TOUTES les offres actives d'un Course (utilise par
    // "sections d'un cours", qui doit maintenant traverser ActiveCourse)
    List<Section> findByActiveCourse_Course_Id(Integer courseId);

    // sections enseignees par un enseignant donne (utile pour la charge d'enseignement)
    List<Section> findByLecturer_Id(long lecturerId);
}
