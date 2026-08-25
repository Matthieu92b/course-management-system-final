package org.example.coursemanagementsystem.repository;

import org.example.coursemanagementsystem.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findBySection_Lecturer_Id(long lecturerId);
    List<Appointment> findBySection_IdIn(List<Long> sectionIds);
    List<Appointment> findBySection_Id(Long sectionId);
}
