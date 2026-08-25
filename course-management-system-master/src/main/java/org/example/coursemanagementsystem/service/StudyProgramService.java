package org.example.coursemanagementsystem.service;

import org.example.coursemanagementsystem.dto.ActiveCourseSummaryDto;
import org.example.coursemanagementsystem.dto.LecturerSummaryDto;
import org.example.coursemanagementsystem.dto.SectionSummaryDto;
import org.example.coursemanagementsystem.dto.StudyProgramDetailDto;
import org.example.coursemanagementsystem.dto.StudyProgramDto;
import org.example.coursemanagementsystem.entity.ActiveCourse;
import org.example.coursemanagementsystem.entity.Department;
import org.example.coursemanagementsystem.entity.Faculty;
import org.example.coursemanagementsystem.entity.Section;
import org.example.coursemanagementsystem.entity.StudyProgram;
import org.example.coursemanagementsystem.entity.User;
import org.example.coursemanagementsystem.exception.ResourceNotFoundException;
import org.example.coursemanagementsystem.repository.ActiveCourseRepository;
import org.example.coursemanagementsystem.repository.DepartmentRepository;
import org.example.coursemanagementsystem.repository.SectionRepository;
import org.example.coursemanagementsystem.repository.StudyProgramRepository;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class StudyProgramService {

    private final StudyProgramRepository studyProgramRepository;
    private final DepartmentRepository departmentRepository;
    private final ActiveCourseRepository activeCourseRepository;
    private final SectionRepository sectionRepository;

    public StudyProgramService(StudyProgramRepository studyProgramRepository,
                               DepartmentRepository departmentRepository,
                               ActiveCourseRepository activeCourseRepository,
                               SectionRepository sectionRepository) {
        this.studyProgramRepository = studyProgramRepository;
        this.departmentRepository = departmentRepository;
        this.activeCourseRepository = activeCourseRepository;
        this.sectionRepository = sectionRepository;
    }

    public List<StudyProgram> getAllStudyPrograms() {
        return studyProgramRepository.findAll();
    }

    public StudyProgram createStudyProgram(StudyProgramDto studyProgramDto) {
        Department department = departmentRepository.findById(studyProgramDto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id " + studyProgramDto.getDepartmentId()));

        StudyProgram studyProgram = new StudyProgram();
        studyProgram.setName(studyProgramDto.getName());
        studyProgram.setLevel(studyProgramDto.getLevel());
        studyProgram.setDepartment(department);

        return studyProgramRepository.save(studyProgram);
    }

    public StudyProgram getStudyProgramById(int id) {
        return studyProgramRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Study program not found with id " + id));
    }

    public StudyProgram updateStudyProgram(int id, StudyProgramDto dto) {
        StudyProgram studyProgram = getStudyProgramById(id);
        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id " + dto.getDepartmentId()));

        studyProgram.setName(dto.getName());
        studyProgram.setLevel(dto.getLevel());
        studyProgram.setDepartment(department);

        return studyProgramRepository.save(studyProgram);
    }

    public void deleteStudyProgram(int id) {
        studyProgramRepository.delete(getStudyProgramById(id));
    }

    // Fonctionnalite metier : cours actifs de ce programme d'etudes.
    public List<ActiveCourseSummaryDto> getCoursesForProgram(Integer studyProgramId) {
        getStudyProgramById(studyProgramId); // 404 si le programme n'existe pas

        return activeCourseRepository.findByStudyProgram_Id(studyProgramId).stream()
                .map(ac -> new ActiveCourseSummaryDto(
                        ac.getId(),
                        ac.getCourse().getId(),
                        ac.getCourse().getCode(),
                        ac.getCourse().getTitle(),
                        ac.getCourse().getCredits(),
                        ac.getAcademicYear().getValue(),
                        ac.getSemester(),
                        ac.getTypology()
                ))
                .toList();
    }

    // Fiche complete d'un programme : departement/faculte parents, cours
    // actifs, sections de ces cours, et enseignants distincts qui y interviennent.
    public StudyProgramDetailDto getStudyProgramDetail(Integer studyProgramId) {
        StudyProgram program = getStudyProgramById(studyProgramId);
        Department department = program.getDepartment();
        Faculty faculty = department.getFaculty();

        List<ActiveCourse> activeCourses = activeCourseRepository.findByStudyProgram_Id(studyProgramId);

        List<ActiveCourseSummaryDto> activeCourseDtos = activeCourses.stream()
                .map(ac -> new ActiveCourseSummaryDto(
                        ac.getId(),
                        ac.getCourse().getId(),
                        ac.getCourse().getCode(),
                        ac.getCourse().getTitle(),
                        ac.getCourse().getCredits(),
                        ac.getAcademicYear().getValue(),
                        ac.getSemester(),
                        ac.getTypology()
                ))
                .toList();

        List<Section> sections = activeCourses.stream()
                .flatMap(ac -> sectionRepository.findByActiveCourse_Id(ac.getId()).stream())
                .toList();

        List<SectionSummaryDto> sectionDtos = sections.stream()
                .map(s -> new SectionSummaryDto(
                        s.getId(),
                        s.getType(),
                        s.getHours(),
                        s.getActiveCourse().getCourse().getCode(),
                        s.getActiveCourse().getCourse().getTitle(),
                        s.getActiveCourse().getAcademicYear().getValue(),
                        s.getActiveCourse().getSemester(),
                        s.getCapacity(),
                        s.getRoom(),
                        s.getDayOfWeek() != null ? s.getDayOfWeek().toString() : null,
                        s.getStartTime() != null ? s.getStartTime().toString() : null,
                        s.getEndTime() != null ? s.getEndTime().toString() : null,
                        s.getLecturer().getId(),
                        s.getLecturer().getFirstName() + " " + s.getLecturer().getLastName()
                ))
                .toList();

        Map<Long, User> lecturersById = new LinkedHashMap<>();
        for (Section s : sections) {
            lecturersById.putIfAbsent(s.getLecturer().getId(), s.getLecturer());
        }
        List<LecturerSummaryDto> lecturerDtos = lecturersById.values().stream()
                .map(u -> new LecturerSummaryDto(u.getId(), u.getFirstName(), u.getLastName(), u.getEmail()))
                .toList();

        return new StudyProgramDetailDto(
                program.getId(),
                program.getName(),
                program.getLevel(),
                department.getId(),
                department.getName(),
                faculty.getId(),
                faculty.getName(),
                activeCourseDtos,
                sectionDtos,
                lecturerDtos
        );
    }
}
