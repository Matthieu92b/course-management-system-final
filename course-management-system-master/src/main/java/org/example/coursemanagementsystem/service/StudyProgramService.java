package org.example.coursemanagementsystem.service;

import org.example.coursemanagementsystem.dto.ActiveCourseSummaryDto;
import org.example.coursemanagementsystem.dto.StudyProgramDto;
import org.example.coursemanagementsystem.entity.Department;
import org.example.coursemanagementsystem.entity.StudyProgram;
import org.example.coursemanagementsystem.exception.ResourceNotFoundException;
import org.example.coursemanagementsystem.repository.ActiveCourseRepository;
import org.example.coursemanagementsystem.repository.DepartmentRepository;
import org.example.coursemanagementsystem.repository.StudyProgramRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudyProgramService {

    private final StudyProgramRepository studyProgramRepository;
    private final DepartmentRepository departmentRepository;
    private final ActiveCourseRepository activeCourseRepository;

    public StudyProgramService(StudyProgramRepository studyProgramRepository,
                               DepartmentRepository departmentRepository,
                               ActiveCourseRepository activeCourseRepository) {
        this.studyProgramRepository = studyProgramRepository;
        this.departmentRepository = departmentRepository;
        this.activeCourseRepository = activeCourseRepository;
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
}
