package org.example.coursemanagementsystem.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Year;

// Groupe/classe d'etudiants (ex: "L1-INFO-A"). Rattache a un programme
// d'etudes et une annee academique, comme ActiveCourse.
@Getter
@Setter
@Entity
@Table(name = "cohorts")
public class Cohort {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "study_program_id", nullable = false)
    private StudyProgram studyProgram;

    @Column(name = "academic_year", nullable = false)
    private Year academicYear;
}
