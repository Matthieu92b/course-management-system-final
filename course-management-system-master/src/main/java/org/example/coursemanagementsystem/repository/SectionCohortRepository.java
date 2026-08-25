package org.example.coursemanagementsystem.repository;

import org.example.coursemanagementsystem.entity.SectionCohort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SectionCohortRepository extends JpaRepository<SectionCohort, Integer> {
    List<SectionCohort> findBySection_Id(Long sectionId);
    List<SectionCohort> findByCohort_Id(Integer cohortId);
    Optional<SectionCohort> findBySection_IdAndCohort_Id(Long sectionId, Integer cohortId);
}
