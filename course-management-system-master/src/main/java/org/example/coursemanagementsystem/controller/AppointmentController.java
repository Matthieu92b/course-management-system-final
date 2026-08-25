package org.example.coursemanagementsystem.controller;

import jakarta.validation.Valid;
import org.example.coursemanagementsystem.dto.AppointmentDetailDto;
import org.example.coursemanagementsystem.dto.AppointmentDto;
import org.example.coursemanagementsystem.dto.AttendanceRecordDto;
import org.example.coursemanagementsystem.dto.AttendanceSaveRequestDto;
import org.example.coursemanagementsystem.dto.ScheduleEntryDto;
import org.example.coursemanagementsystem.entity.Appointment;
import org.example.coursemanagementsystem.service.AppointmentService;
import org.example.coursemanagementsystem.service.AttendanceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final AttendanceService attendanceService;

    public AppointmentController(AppointmentService appointmentService, AttendanceService attendanceService) {
        this.appointmentService = appointmentService;
        this.attendanceService = attendanceService;
    }

    @GetMapping("/appointments")
    public List<Appointment> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @GetMapping("/appointments/{id}")
    public Appointment getAppointmentById(@PathVariable Long id) {
        return appointmentService.getAppointmentById(id);
    }

    @PostMapping("/appointments")
    public Appointment createAppointment(@Valid @RequestBody AppointmentDto dto) {
        return appointmentService.createAppointment(dto);
    }

    @PutMapping("/appointments/{id}")
    public Appointment updateAppointment(@PathVariable Long id, @Valid @RequestBody AppointmentDto dto) {
        return appointmentService.updateAppointment(id, dto);
    }

    @DeleteMapping("/appointments/{id}")
    public void deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
    }

    // Fiche complete pour l'enseignant : cours, salle, cohorte(s), etudiants.
    @GetMapping("/appointments/{id}/detail")
    public AppointmentDetailDto getAppointmentDetail(@PathVariable Long id) {
        return appointmentService.getAppointmentDetail(id);
    }

    // Planning hebdomadaire d'un enseignant (toutes ses sections confondues).
    @GetMapping("/appointments/lecturer/{lecturerId}")
    public List<ScheduleEntryDto> getLecturerSchedule(@PathVariable long lecturerId) {
        return appointmentService.getLecturerSchedule(lecturerId);
    }

    // Planning hebdomadaire d'un etudiant, derive de sa cohorte.
    @GetMapping("/appointments/student/{studentId}")
    public List<ScheduleEntryDto> getStudentSchedule(@PathVariable long studentId) {
        return appointmentService.getStudentSchedule(studentId);
    }

    @GetMapping("/appointments/{id}/attendance")
    public List<AttendanceRecordDto> getAttendance(@PathVariable Long id) {
        return attendanceService.getAttendanceForAppointment(id);
    }

    @PostMapping("/appointments/{id}/attendance")
    public List<AttendanceRecordDto> saveAttendance(@PathVariable Long id, @Valid @RequestBody AttendanceSaveRequestDto dto) {
        return attendanceService.saveAttendance(id, dto.getEntries());
    }
}
