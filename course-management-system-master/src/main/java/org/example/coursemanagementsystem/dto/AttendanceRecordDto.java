package org.example.coursemanagementsystem.dto;

import org.example.coursemanagementsystem.entity.enums.AttendanceStatus;

/**
 * Ligne d'assiduite pour un etudiant sur un Appointment donne. status est
 * null si l'enseignant n'a pas encore enregistre de presence pour cet
 * etudiant sur cette seance.
 */
public class AttendanceRecordDto {

    private long studentId;
    private String studentName;
    private AttendanceStatus status;

    public AttendanceRecordDto(long studentId, String studentName, AttendanceStatus status) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.status = status;
    }

    public long getStudentId() { return studentId; }
    public String getStudentName() { return studentName; }
    public AttendanceStatus getStatus() { return status; }
}
