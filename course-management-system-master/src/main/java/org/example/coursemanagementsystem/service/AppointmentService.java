package org.example.coursemanagementsystem.service;

import org.example.coursemanagementsystem.dto.AppointmentDetailDto;
import org.example.coursemanagementsystem.dto.AppointmentDto;
import org.example.coursemanagementsystem.dto.CohortSummaryDto;
import org.example.coursemanagementsystem.dto.LecturerSummaryDto;
import org.example.coursemanagementsystem.dto.ScheduleEntryDto;
import org.example.coursemanagementsystem.entity.Appointment;
import org.example.coursemanagementsystem.entity.Cohort;
import org.example.coursemanagementsystem.entity.Section;
import org.example.coursemanagementsystem.entity.SectionCohort;
import org.example.coursemanagementsystem.entity.User;
import org.example.coursemanagementsystem.exception.InvalidRequestException;
import org.example.coursemanagementsystem.exception.ResourceNotFoundException;
import org.example.coursemanagementsystem.repository.AppointmentRepository;
import org.example.coursemanagementsystem.repository.SectionCohortRepository;
import org.example.coursemanagementsystem.repository.SectionRepository;
import org.example.coursemanagementsystem.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Occurrences datees des sections (Appointment) et plannings hebdomadaires
 * qui en decoulent pour un enseignant (via Section.lecturer) ou un
 * etudiant/cohorte (via SectionCohort).
 */
@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final SectionRepository sectionRepository;
    private final SectionCohortRepository sectionCohortRepository;
    private final UserRepository userRepository;

    public AppointmentService(AppointmentRepository appointmentRepository,
                              SectionRepository sectionRepository,
                              SectionCohortRepository sectionCohortRepository,
                              UserRepository userRepository) {
        this.appointmentRepository = appointmentRepository;
        this.sectionRepository = sectionRepository;
        this.sectionCohortRepository = sectionCohortRepository;
        this.userRepository = userRepository;
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id " + id));
    }

    public Appointment createAppointment(AppointmentDto dto) {
        Section section = getSection(dto.getSectionId());
        assertDateMatchesSectionDay(section, dto);

        Appointment appointment = new Appointment();
        appointment.setSection(section);
        appointment.setDate(dto.getDate());

        return appointmentRepository.save(appointment);
    }

    public Appointment updateAppointment(Long id, AppointmentDto dto) {
        Appointment appointment = getAppointmentById(id);
        Section section = getSection(dto.getSectionId());
        assertDateMatchesSectionDay(section, dto);

        appointment.setSection(section);
        appointment.setDate(dto.getDate());

        return appointmentRepository.save(appointment);
    }

    public void deleteAppointment(Long id) {
        appointmentRepository.delete(getAppointmentById(id));
    }

    // Planning hebdomadaire d'un enseignant : toutes les occurrences des
    // sections dont il est l'enseignant.
    public List<ScheduleEntryDto> getLecturerSchedule(long lecturerId) {
        return appointmentRepository.findBySection_Lecturer_Id(lecturerId).stream()
                .map(this::toScheduleEntry)
                .toList();
    }

    // Planning hebdomadaire d'une cohorte : toutes les occurrences des
    // sections rattachees a cette cohorte via SectionCohort.
    public List<ScheduleEntryDto> getCohortSchedule(Integer cohortId) {
        List<Long> sectionIds = sectionCohortRepository.findByCohort_Id(cohortId).stream()
                .map(sc -> sc.getSection().getId())
                .toList();

        if (sectionIds.isEmpty()) {
            return List.of();
        }

        return appointmentRepository.findBySection_IdIn(sectionIds).stream()
                .map(this::toScheduleEntry)
                .toList();
    }

    // Planning hebdomadaire d'un etudiant : derive automatiquement de sa
    // cohorte (l'etudiant lui-meme n'est jamais rattache directement a une
    // section).
    public List<ScheduleEntryDto> getStudentSchedule(long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + studentId));

        Cohort cohort = student.getCohort();
        if (cohort == null) {
            throw new InvalidRequestException("This user is not assigned to a cohort");
        }

        return getCohortSchedule(cohort.getId());
    }

    // Fiche complete d'un Appointment pour l'enseignant qui prend les presences :
    // cours, salle, cohorte(s) rattachees a la section, et union des etudiants
    // de ces cohortes.
    public AppointmentDetailDto getAppointmentDetail(Long appointmentId) {
        Appointment appointment = getAppointmentById(appointmentId);
        Section section = appointment.getSection();
        User lecturer = section.getLecturer();

        List<SectionCohort> sectionCohorts = sectionCohortRepository.findBySection_Id(section.getId());
        List<CohortSummaryDto> cohortDtos = sectionCohorts.stream()
                .map(sc -> new CohortSummaryDto(sc.getCohort().getId(), sc.getCohort().getName()))
                .toList();

        List<LecturerSummaryDto> students = getStudentsForAppointment(appointment).stream()
                .map(u -> new LecturerSummaryDto(u.getId(), u.getFirstName(), u.getLastName(), u.getEmail()))
                .toList();

        return new AppointmentDetailDto(
                appointment.getId(),
                appointment.getDate(),
                section.getDayOfWeek(),
                section.getStartTime(),
                section.getEndTime(),
                section.getRoom(),
                section.getCapacity(),
                section.getType(),
                section.getActiveCourse().getCourse().getCode(),
                section.getActiveCourse().getCourse().getTitle(),
                lecturer.getId(),
                lecturer.getFirstName() + " " + lecturer.getLastName(),
                cohortDtos,
                students
        );
    }

    // Union (dedupliquee) des etudiants de toutes les cohortes rattachees a
    // la section de cet Appointment. Reutilise par AttendanceService pour
    // savoir a qui l'enseignant doit pouvoir attribuer une presence.
    public List<User> getStudentsForAppointment(Appointment appointment) {
        List<Integer> cohortIds = sectionCohortRepository.findBySection_Id(appointment.getSection().getId()).stream()
                .map(sc -> sc.getCohort().getId())
                .toList();

        Map<Long, User> studentsById = new LinkedHashMap<>();
        for (Integer cohortId : cohortIds) {
            for (User student : userRepository.findByCohort_Id(cohortId)) {
                studentsById.putIfAbsent(student.getId(), student);
            }
        }
        return studentsById.values().stream().toList();
    }

    private Section getSection(Long sectionId) {
        return sectionRepository.findById(sectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Section not found with id " + sectionId));
    }

    // Garde-fou : une occurrence doit tomber le meme jour de la semaine que
    // le creneau recurrent de sa section (si ce creneau est renseigne).
    private void assertDateMatchesSectionDay(Section section, AppointmentDto dto) {
        if (section.getDayOfWeek() != null && dto.getDate().getDayOfWeek() != section.getDayOfWeek()) {
            throw new InvalidRequestException(String.format(
                    "This appointment's date (%s) falls on a %s, but the section meets on %s",
                    dto.getDate(), dto.getDate().getDayOfWeek(), section.getDayOfWeek()
            ));
        }
    }

    private ScheduleEntryDto toScheduleEntry(Appointment appointment) {
        Section section = appointment.getSection();
        List<String> cohortNames = sectionCohortRepository.findBySection_Id(section.getId()).stream()
                .map(sc -> sc.getCohort().getName())
                .toList();

        return new ScheduleEntryDto(
                appointment.getId(),
                section.getId(),
                appointment.getDate(),
                section.getDayOfWeek(),
                section.getStartTime(),
                section.getEndTime(),
                section.getActiveCourse().getCourse().getCode(),
                section.getActiveCourse().getCourse().getTitle(),
                section.getType(),
                section.getRoom(),
                section.getLecturer().getFirstName() + " " + section.getLecturer().getLastName(),
                cohortNames
        );
    }
}
