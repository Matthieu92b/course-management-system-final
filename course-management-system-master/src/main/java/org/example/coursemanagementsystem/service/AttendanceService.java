package org.example.coursemanagementsystem.service;

import org.example.coursemanagementsystem.dto.AttendanceEntryDto;
import org.example.coursemanagementsystem.dto.AttendanceRecordDto;
import org.example.coursemanagementsystem.entity.Appointment;
import org.example.coursemanagementsystem.entity.Attendance;
import org.example.coursemanagementsystem.entity.User;
import org.example.coursemanagementsystem.exception.InvalidRequestException;
import org.example.coursemanagementsystem.exception.ResourceNotFoundException;
import org.example.coursemanagementsystem.repository.AttendanceRepository;
import org.example.coursemanagementsystem.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Assiduite par Appointment (seance datee) : un etudiant peut etre present a
 * une seance et absent a une autre seance de la meme section, d'ou le
 * rattachement a Appointment plutot qu'a Section.
 */
@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final AppointmentService appointmentService;
    private final UserRepository userRepository;

    public AttendanceService(AttendanceRepository attendanceRepository,
                             AppointmentService appointmentService,
                             UserRepository userRepository) {
        this.attendanceRepository = attendanceRepository;
        this.appointmentService = appointmentService;
        this.userRepository = userRepository;
    }

    // Etat d'assiduite de tous les etudiants concernes par cet Appointment
    // (union des cohortes de la section), avec status=null pour ceux qui
    // n'ont pas encore ete pointes.
    public List<AttendanceRecordDto> getAttendanceForAppointment(Long appointmentId) {
        Appointment appointment = appointmentService.getAppointmentById(appointmentId);
        List<User> students = appointmentService.getStudentsForAppointment(appointment);

        Map<Long, Attendance> existingByStudentId = attendanceRepository.findByAppointment_Id(appointmentId).stream()
                .collect(Collectors.toMap(a -> a.getStudent().getId(), a -> a));

        return students.stream()
                .map(student -> {
                    Attendance existing = existingByStudentId.get(student.getId());
                    return new AttendanceRecordDto(
                            student.getId(),
                            student.getFirstName() + " " + student.getLastName(),
                            existing != null ? existing.getStatus() : null
                    );
                })
                .toList();
    }

    // Upsert : cree ou met a jour l'enregistrement d'assiduite de chaque
    // etudiant liste pour cet Appointment precis.
    public List<AttendanceRecordDto> saveAttendance(Long appointmentId, List<AttendanceEntryDto> entries) {
        Appointment appointment = appointmentService.getAppointmentById(appointmentId);
        List<Long> validStudentIds = appointmentService.getStudentsForAppointment(appointment).stream()
                .map(User::getId)
                .toList();

        for (AttendanceEntryDto entry : entries) {
            if (!validStudentIds.contains(entry.getStudentId())) {
                throw new InvalidRequestException(
                        "Student " + entry.getStudentId() + " does not belong to any cohort of this appointment's section");
            }

            User student = userRepository.findById(entry.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + entry.getStudentId()));

            Attendance attendance = attendanceRepository.findByAppointment_IdAndStudent_Id(appointmentId, student.getId())
                    .orElseGet(() -> {
                        Attendance a = new Attendance();
                        a.setAppointment(appointment);
                        a.setStudent(student);
                        return a;
                    });
            attendance.setStatus(entry.getStatus());
            attendanceRepository.save(attendance);
        }

        return getAttendanceForAppointment(appointmentId);
    }
}
