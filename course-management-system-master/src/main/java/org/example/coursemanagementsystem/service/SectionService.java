package org.example.coursemanagementsystem.service;

import org.example.coursemanagementsystem.dto.LecturerSummaryDto;
import org.example.coursemanagementsystem.dto.SectionDto;
import org.example.coursemanagementsystem.entity.ActiveCourse;
import org.example.coursemanagementsystem.entity.Section;
import org.example.coursemanagementsystem.entity.User;
import org.example.coursemanagementsystem.exception.ResourceNotFoundException;
import org.example.coursemanagementsystem.exception.ScheduleConflictException;
import org.example.coursemanagementsystem.repository.ActiveCourseRepository;
import org.example.coursemanagementsystem.repository.SectionRepository;
import org.example.coursemanagementsystem.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalTime;
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

        assertValidTimeRange(dto);
        assertNoScheduleConflict(dto, activeCourse, null);

        Section section = new Section();
        section.setType(dto.getType());
        section.setHours(dto.getHours());
        section.setActiveCourse(activeCourse);
        section.setLecturer(lecturer);
        section.setCapacity(dto.getCapacity());
        section.setRoom(dto.getRoom());
        section.setDayOfWeek(dto.getDayOfWeek());
        section.setStartTime(dto.getStartTime());
        section.setEndTime(dto.getEndTime());

        return sectionRepository.save(section);
    }

    public Section updateSection(Long id, SectionDto dto) {
        Section section = getSectionById(id);

        ActiveCourse activeCourse = activeCourseRepository.findById(dto.getActiveCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("ActiveCourse not found with id " + dto.getActiveCourseId()));

        User lecturer = userRepository.findById(dto.getLecturerId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + dto.getLecturerId()));

        assertValidTimeRange(dto);
        assertNoScheduleConflict(dto, activeCourse, id);

        section.setType(dto.getType());
        section.setHours(dto.getHours());
        section.setActiveCourse(activeCourse);
        section.setLecturer(lecturer);
        section.setCapacity(dto.getCapacity());
        section.setRoom(dto.getRoom());
        section.setDayOfWeek(dto.getDayOfWeek());
        section.setStartTime(dto.getStartTime());
        section.setEndTime(dto.getEndTime());

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

    private void assertValidTimeRange(SectionDto dto) {
        if (!dto.getStartTime().isBefore(dto.getEndTime())) {
            throw new ScheduleConflictException("startTime must be before endTime");
        }
    }

    // Regle metier : un enseignant ne peut pas avoir deux sections qui se
    // chevauchent (meme jour, meme creneau horaire) au cours du meme
    // semestre/annee academique. Les sections sans horaire renseigne
    // (donnees historiques) sont ignorees par ce controle.
    private void assertNoScheduleConflict(SectionDto dto, ActiveCourse targetCourse, Long excludeSectionId) {
        DayOfWeek day = dto.getDayOfWeek();
        LocalTime start = dto.getStartTime();
        LocalTime end = dto.getEndTime();

        List<Section> lecturerSections = sectionRepository.findByLecturer_Id(dto.getLecturerId());

        for (Section existing : lecturerSections) {
            if (excludeSectionId != null && excludeSectionId.equals(existing.getId())) {
                continue;
            }
            if (existing.getDayOfWeek() == null || existing.getStartTime() == null || existing.getEndTime() == null) {
                continue;
            }

            ActiveCourse existingCourse = existing.getActiveCourse();
            if (existingCourse == null) {
                continue;
            }

            boolean sameTerm = existingCourse.getAcademicYear().equals(targetCourse.getAcademicYear())
                    && existingCourse.getSemester().equals(targetCourse.getSemester());
            if (!sameTerm || existing.getDayOfWeek() != day) {
                continue;
            }

            boolean overlaps = start.isBefore(existing.getEndTime()) && existing.getStartTime().isBefore(end);
            if (overlaps) {
                throw new ScheduleConflictException(String.format(
                        "This lecturer already has section #%d (%s) on %s %s-%s during %s S%d — schedules overlap.",
                        existing.getId(),
                        existing.getActiveCourse().getCourse().getCode(),
                        existing.getDayOfWeek(),
                        existing.getStartTime(),
                        existing.getEndTime(),
                        targetCourse.getAcademicYear(),
                        targetCourse.getSemester()
                ));
            }
        }
    }
}
