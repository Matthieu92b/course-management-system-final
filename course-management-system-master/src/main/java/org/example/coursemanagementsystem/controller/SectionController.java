package org.example.coursemanagementsystem.controller;

import jakarta.validation.Valid;
import org.example.coursemanagementsystem.dto.LecturerSummaryDto;
import org.example.coursemanagementsystem.dto.SectionDto;
import org.example.coursemanagementsystem.entity.Section;
import org.example.coursemanagementsystem.service.SectionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sections")
public class SectionController {

    private final SectionService sectionService;

    public SectionController(SectionService sectionService) {
        this.sectionService = sectionService;
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
}
