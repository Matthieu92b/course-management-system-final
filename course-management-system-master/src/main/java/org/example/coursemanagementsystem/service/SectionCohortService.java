package org.example.coursemanagementsystem.service;

import org.example.coursemanagementsystem.dto.CohortSummaryDto;
import org.example.coursemanagementsystem.entity.Cohort;
import org.example.coursemanagementsystem.entity.Section;
import org.example.coursemanagementsystem.entity.SectionCohort;
import org.example.coursemanagementsystem.exception.DuplicateResourceException;
import org.example.coursemanagementsystem.exception.ResourceNotFoundException;
import org.example.coursemanagementsystem.repository.CohortRepository;
import org.example.coursemanagementsystem.repository.SectionCohortRepository;
import org.example.coursemanagementsystem.repository.SectionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Rattachement des cohortes/classes aux sections (table de liaison
 * SectionCohort) : determine quelles cohortes suivent quelle section, base
 * du planning etudiant (getStudentSchedule) et de la liste d'etudiants a
 * prendre en presence pour un Appointment.
 */
@Service
public class SectionCohortService {

    private final SectionCohortRepository sectionCohortRepository;
    private final SectionRepository sectionRepository;
    private final CohortRepository cohortRepository;

    public SectionCohortService(SectionCohortRepository sectionCohortRepository,
                                SectionRepository sectionRepository,
                                CohortRepository cohortRepository) {
        this.sectionCohortRepository = sectionCohortRepository;
        this.sectionRepository = sectionRepository;
        this.cohortRepository = cohortRepository;
    }

    public List<CohortSummaryDto> getCohortsForSection(Long sectionId) {
        ensureSectionExists(sectionId);

        return sectionCohortRepository.findBySection_Id(sectionId).stream()
                .map(sc -> new CohortSummaryDto(sc.getCohort().getId(), sc.getCohort().getName()))
                .toList();
    }

    public SectionCohort assignCohort(Long sectionId, Integer cohortId) {
        Section section = sectionRepository.findById(sectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Section not found with id " + sectionId));
        Cohort cohort = cohortRepository.findById(cohortId)
                .orElseThrow(() -> new ResourceNotFoundException("Cohort not found with id " + cohortId));

        sectionCohortRepository.findBySection_IdAndCohort_Id(sectionId, cohortId).ifPresent(existing -> {
            throw new DuplicateResourceException("This cohort is already assigned to this section");
        });

        SectionCohort sectionCohort = new SectionCohort();
        sectionCohort.setSection(section);
        sectionCohort.setCohort(cohort);

        return sectionCohortRepository.save(sectionCohort);
    }

    public void unassignCohort(Long sectionId, Integer cohortId) {
        SectionCohort sectionCohort = sectionCohortRepository.findBySection_IdAndCohort_Id(sectionId, cohortId)
                .orElseThrow(() -> new ResourceNotFoundException("This cohort is not assigned to this section"));

        sectionCohortRepository.delete(sectionCohort);
    }

    private void ensureSectionExists(Long sectionId) {
        if (!sectionRepository.existsById(sectionId)) {
            throw new ResourceNotFoundException("Section not found with id " + sectionId);
        }
    }
}
