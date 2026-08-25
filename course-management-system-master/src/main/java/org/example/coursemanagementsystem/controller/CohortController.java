package org.example.coursemanagementsystem.controller;

import jakarta.validation.Valid;
import org.example.coursemanagementsystem.dto.CohortDto;
import org.example.coursemanagementsystem.entity.Cohort;
import org.example.coursemanagementsystem.service.CohortService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cohorts")
public class CohortController {

    private final CohortService cohortService;

    public CohortController(CohortService cohortService) {
        this.cohortService = cohortService;
    }

    @GetMapping
    public List<Cohort> getAllCohorts() {
        return cohortService.getAllCohorts();
    }

    @GetMapping("/{id}")
    public Cohort getCohortById(@PathVariable Integer id) {
        return cohortService.getCohortById(id);
    }

    @PostMapping
    public Cohort createCohort(@Valid @RequestBody CohortDto dto) {
        return cohortService.createCohort(dto);
    }

    @PutMapping("/{id}")
    public Cohort updateCohort(@PathVariable Integer id, @Valid @RequestBody CohortDto dto) {
        return cohortService.updateCohort(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteCohort(@PathVariable Integer id) {
        cohortService.deleteCohort(id);
    }
}
