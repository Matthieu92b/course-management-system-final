package org.example.coursemanagementsystem.repository;

import org.example.coursemanagementsystem.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByAppointment_Id(Long appointmentId);
    Optional<Attendance> findByAppointment_IdAndStudent_Id(Long appointmentId, long studentId);
}
