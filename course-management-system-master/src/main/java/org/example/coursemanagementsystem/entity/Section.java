package org.example.coursemanagementsystem.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.example.coursemanagementsystem.entity.enums.SectionType;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Getter
@Setter
@Entity
@Table(name = "sections")
public class Section {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SectionType type;

    @Column(nullable = false)
    private Integer hours;

    @ManyToOne
    @JoinColumn(name = "active_course_id", nullable = false)
    private ActiveCourse activeCourse;

    @ManyToOne
    @JoinColumn(name = "lecturer_id", nullable = false)
    private User lecturer;

    // Nombre de places disponibles dans cette section.
    private Integer capacity;

    // Salle ou se deroule la section.
    private String room;

    // Creneau horaire de la section : sert a detecter les conflits d'affectation
    // (un meme enseignant ne peut pas avoir deux sections qui se chevauchent).
    // Nullable pour rester compatible avec des sections existantes sans horaire.
    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week")
    private DayOfWeek dayOfWeek;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;
}
