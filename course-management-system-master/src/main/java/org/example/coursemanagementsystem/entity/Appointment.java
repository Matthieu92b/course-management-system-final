package org.example.coursemanagementsystem.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

// Occurrence datee d'une Section (qui ne porte que le creneau hebdomadaire
// recurrent : jour + heure de debut/fin). Un Appointment est LA session
// concrete a laquelle l'assiduite (Attendance) est rattachee, puisqu'un
// etudiant peut etre present a une seance et absent a une autre seance
// de la meme section.
@Getter
@Setter
@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "section_id", nullable = false)
    private Section section;

    @Column(nullable = false)
    private LocalDate date;
}
