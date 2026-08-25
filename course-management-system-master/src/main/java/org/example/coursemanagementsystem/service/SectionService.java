package org.example.coursemanagementsystem.service;

import org.example.coursemanagementsystem.dto.LecturerSummaryDto;
import org.example.coursemanagementsystem.dto.SectionDto;
import org.example.coursemanagementsystem.entity.ActiveCourse;
import org.example.coursemanagementsystem.entity.Section;
import org.example.coursemanagementsystem.entity.User;
import org.example.coursemanagementsystem.exception.ResourceNotFoundException;
import org.example.coursemanagementsystem.repository.ActiveCourseRepository;
import org.example.coursemanagementsystem.repository.SectionRepository;
import org.example.coursemanagementsystem.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SectionService {

    private final SectionRepository sectionRepository;
    private final ActiveCourseRepository activeCourseRepository;
    private final UserRepository userRepository;

    public SectionService(SectionRepository sectionRepository,
                          ActiveCourseRepository activeCourseRepository,
                          UserRepository userRepository) {
        this.sectionRepository = sectionRepository;
        this.activeCourseRepository = activeCourseRepository;
        this.userRepository = userRepository;
    }

    public List<Section> getAllSections() {
        return sectionRepository.findAll();
    }

    public Section getSectionById(Long id) {
        return sectionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Section not found with id " + id));
    }

    public Section createSection(SectionDto dto) {
        ActiveCourse activeCourse = activeCourseRepository.findById(dto.getActiveCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("ActiveCourse not found with id " + dto.getActiveCourseId()));

        User lecturer = userRepository.findById(dto.getLecturerId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + dto.getLecturerId()));

        Section section = new Section();
        section.setType(dto.getType());
        section.setHours(dto.getHours());
        section.setActiveCourse(activeCourse);
        section.setLecturer(lecturer);

        return sectionRepository.save(section);
    }

    public Section updateSection(Long id, SectionDto dto) {
        Section section = getSectionById(id);

        ActiveCourse activeCourse = activeCourseRepository.findById(dto.getActiveCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("ActiveCourse not found with id " + dto.getActiveCourseId()));

        User lecturer = userRepository.findById(dto.getLecturerId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + dto.getLecturerId()));

        section.setType(dto.getType());
        section.setHours(dto.getHours());
        section.setActiveCourse(activeCourse);
        section.setLecturer(lecturer);

        return sectionRepository.save(section);
    }

    public void deleteSection(Long id) {
        sectionRepository.delete(getSectionById(id));
    }

    // Fonctionnalite metier : enseignant de cette section.
    // Avant la refacto, une section pouvait avoir plusieurs enseignants
    // (table SectionLecturer). Desormais la relation User -> Section est
    // en One-to-Many : une section n'a plus qu'UN SEUL enseignant.
    public LecturerSummaryDto getLecturerForSection(Long sectionId) {
        Section section = getSectionById(sectionId);
        User lecturer = section.getLecturer();

        return new LecturerSummaryDto(
                lecturer.getId(),
                lecturer.getFirstName(),
                lecturer.getLastName(),
                lecturer.getEmail()
        );
    }
}
