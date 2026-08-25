package org.example.coursemanagementsystem.service;

import org.example.coursemanagementsystem.dto.CohortDto;
import org.example.coursemanagementsystem.entity.Cohort;
import org.example.coursemanagementsystem.entity.StudyProgram;
import org.example.coursemanagementsystem.exception.ResourceNotFoundException;
import org.example.coursemanagementsystem.repository.CohortRepository;
import org.example.coursemanagementsystem.repository.StudyProgramRepository;
import org.springframework.stereotype.Service;

import java.time.Year;
import java.util.List;

@Service
public class CohortService {

    private final CohortRepository cohortRepository;
    private final StudyProgramRepository studyProgramRepository;

    public CohortService(CohortRepository cohortRepository, StudyProgramRepository studyProgramRepository) {
        this.cohortRepository = cohortRepository;
        this.studyProgramRepository = studyProgramRepository;
    }

    public List<Cohort> getAllCohorts() {
        return cohortRepository.findAll();
    }

    public Cohort getCohortById(Integer id) {
        return cohortRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cohort not found with id " + id));
    }

    public Cohort createCohort(CohortDto dto) {
        StudyProgram studyProgram = getStudyProgram(dto.getStudyProgramId());

        Cohort cohort = new Cohort();
        cohort.setName(dto.getName());
        cohort.setStudyProgram(studyProgram);
        cohort.setAcademicYear(Year.of(dto.getAcademicYear()));

        return cohortRepository.save(cohort);
    }

    public Cohort updateCohort(Integer id, CohortDto dto) {
        Cohort cohort = getCohortById(id);
        StudyProgram studyProgram = getStudyProgram(dto.getStudyProgramId());

        cohort.setName(dto.getName());
        cohort.setStudyProgram(studyProgram);
        cohort.setAcademicYear(Year.of(dto.getAcademicYear()));

        return cohortRepository.save(cohort);
    }

    public void deleteCohort(Integer id) {
        cohortRepository.delete(getCohortById(id));
    }

    private StudyProgram getStudyProgram(Integer studyProgramId) {
        return studyProgramRepository.findById(studyProgramId)
                .orElseThrow(() -> new ResourceNotFoundException("StudyProgram not found with id " + studyProgramId));
    }
}
