package org.example.coursemanagementsystem.dto;

import org.example.coursemanagementsystem.entity.enums.SectionType;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * Une entree du planning hebdomadaire, pour un enseignant (getLecturerSchedule)
 * ou un etudiant/cohorte (getCohortSchedule / getStudentSchedule). Les deux
 * vues partagent le meme shape ; seuls lecturerName (vue etudiant) et
 * cohortNames (vue enseignant) different selon le consommateur.
 */
public class ScheduleEntryDto {

    private Long appointmentId;
    private Long sectionId;
    private LocalDate date;
    private DayOfWeek dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private String courseCode;
    private String courseTitle;
    private SectionType sectionType;
    private String room;
    private String lecturerName;
    private List<String> cohortNames;

    public ScheduleEntryDto(Long appointmentId, Long sectionId, LocalDate date, DayOfWeek dayOfWeek,
                             LocalTime startTime, LocalTime endTime, String courseCode, String courseTitle,
                             SectionType sectionType, String room, String lecturerName, List<String> cohortNames) {
        this.appointmentId = appointmentId;
        this.sectionId = sectionId;
        this.date = date;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
        this.courseCode = courseCode;
        this.courseTitle = courseTitle;
        this.sectionType = sectionType;
        this.room = room;
        this.lecturerName = lecturerName;
        this.cohortNames = cohortNames;
    }

    public Long getAppointmentId() { return appointmentId; }
    public Long getSectionId() { return sectionId; }
    public LocalDate getDate() { return date; }
    public DayOfWeek getDayOfWeek() { return dayOfWeek; }
    public LocalTime getStartTime() { return startTime; }
    public LocalTime getEndTime() { return endTime; }
    public String getCourseCode() { return courseCode; }
    public String getCourseTitle() { return courseTitle; }
    public SectionType getSectionType() { return sectionType; }
    public String getRoom() { return room; }
    public String getLecturerName() { return lecturerName; }
    public List<String> getCohortNames() { return cohortNames; }
}
