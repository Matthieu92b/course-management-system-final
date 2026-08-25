package org.example.coursemanagementsystem.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.example.coursemanagementsystem.entity.enums.AttendanceStatus;

// Assiduite d'un etudiant a un Appointment precis (une seance datee), et
// non a la Section en general : un etudiant peut avoir un statut different
// a chaque seance de la meme section.
@Getter
@Setter
@Entity
@Table(name = "attendances", uniqueConstraints = @UniqueConstraint(columnNames = {"appointment_id", "student_id"}))
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AttendanceStatus status;
}
