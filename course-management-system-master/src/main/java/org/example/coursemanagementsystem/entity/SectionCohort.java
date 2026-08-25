package org.example.coursemanagementsystem.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

// Table de liaison Section <-> Cohort : une section peut etre suivie par
// plusieurs cohortes, et une cohorte suit plusieurs sections.
@Getter
@Setter
@Entity
@Table(name = "section_cohorts", uniqueConstraints = @UniqueConstraint(columnNames = {"section_id", "cohort_id"}))
public class SectionCohort {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "section_id", nullable = false)
    private Section section;

    @ManyToOne
    @JoinColumn(name = "cohort_id", nullable = false)
    private Cohort cohort;
}
