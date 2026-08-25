package org.example.coursemanagementsystem.controller;

import jakarta.validation.Valid;
import org.example.coursemanagementsystem.dto.CohortSummaryDto;
import org.example.coursemanagementsystem.dto.LecturerSummaryDto;
import org.example.coursemanagementsystem.dto.SectionCohortDto;
import org.example.coursemanagementsystem.dto.SectionDto;
import org.example.coursemanagementsystem.entity.Section;
import org.example.coursemanagementsystem.entity.SectionCohort;
import org.example.coursemanagementsystem.service.SectionCohortService;
import org.example.coursemanagementsystem.service.SectionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sections")
public class SectionController {

    private final SectionService sectionService;
    private final SectionCohortService sectionCohortService;

    public SectionController(SectionService sectionService, SectionCohortService sectionCohortService) {
        this.sectionService = sectionService;
        this.sectionCohortService = sectionCohortService;
    }

    @GetMapping
    public List<Section> getAllSections() {
        return sectionService.getAllSections();
    }

    @GetMapping("/{id}")
    public Section getSectionById(@PathVariable Long id) {
        return sectionService.getSectionById(id);
    }

    @PostMapping
    public Section createSection(@Valid @RequestBody SectionDto sectionDto) {
        return sectionService.createSection(sectionDto);
    }

    @PutMapping("/{id}")
    public Section updateSection(@PathVariable Long id, @Valid @RequestBody SectionDto dto) {
        return sectionService.updateSection(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteSection(@PathVariable Long id) {
        sectionService.deleteSection(id);
    }

    // Avant la refacto : /{id}/lecturers (liste, plusieurs enseignants possibles).
    // Maintenant : un seul enseignant par section -> endpoint au singulier,
    // renvoie un objet et non une liste.
    @GetMapping("/{id}/lecturer")
    public LecturerSummaryDto getLecturerForSection(@PathVariable Long id) {
        return sectionService.getLecturerForSection(id);
    }

    // Cohortes/classes rattachees a cette section (base du planning etudiant).
    @GetMapping("/{id}/cohorts")
    public List<CohortSummaryDto> getCohortsForSection(@PathVariable Long id) {
        return sectionCohortService.getCohortsForSection(id);
    }

    @PostMapping("/{id}/cohorts")
    public SectionCohort assignCohort(@PathVariable Long id, @Valid @RequestBody SectionCohortDto dto) {
        return sectionCohortService.assignCohort(id, dto.getCohortId());
    }

    @DeleteMapping("/{id}/cohorts/{cohortId}")
    public void unassignCohort(@PathVariable Long id, @PathVariable Integer cohortId) {
        sectionCohortService.unassignCohort(id, cohortId);
    }
}
