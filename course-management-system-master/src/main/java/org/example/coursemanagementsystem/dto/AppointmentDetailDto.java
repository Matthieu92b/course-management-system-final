package org.example.coursemanagementsystem.dto;

import org.example.coursemanagementsystem.entity.enums.SectionType;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * Fiche complete d'un Appointment : ouverte par l'enseignant en cliquant sur
 * une seance de son planning pour voir le cours, la salle, la/les cohorte(s)
 * et la liste des etudiants a prendre en presence.
 */
public class AppointmentDetailDto {

    private Long id;
    private LocalDate date;
    private DayOfWeek dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private String room;
    private Integer capacity;
    private SectionType sectionType;
    private String courseCode;
    private String courseTitle;
    private long lecturerId;
    private String lecturerName;
    private List<CohortSummaryDto> cohorts;
    private List<LecturerSummaryDto> students;

    public AppointmentDetailDto(Long id, LocalDate date, DayOfWeek dayOfWeek, LocalTime startTime, LocalTime endTime,
                                 String room, Integer capacity, SectionType sectionType, String courseCode,
                                 String courseTitle, long lecturerId, String lecturerName,
                                 List<CohortSummaryDto> cohorts, List<LecturerSummaryDto> students) {
        this.id = id;
        this.date = date;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
        this.room = room;
        this.capacity = capacity;
        this.sectionType = sectionType;
        this.courseCode = courseCode;
        this.courseTitle = courseTitle;
        this.lecturerId = lecturerId;
        this.lecturerName = lecturerName;
        this.cohorts = cohorts;
        this.students = students;
    }

    public Long getId() { return id; }
    public LocalDate getDate() { return date; }
    public DayOfWeek getDayOfWeek() { return dayOfWeek; }
    public LocalTime getStartTime() { return startTime; }
    public LocalTime getEndTime() { return endTime; }
    public String getRoom() { return room; }
    public Integer getCapacity() { return capacity; }
    public SectionType getSectionType() { return sectionType; }
    public String getCourseCode() { return courseCode; }
    public String getCourseTitle() { return courseTitle; }
    public long getLecturerId() { return lecturerId; }
    public String getLecturerName() { return lecturerName; }
    public List<CohortSummaryDto> getCohorts() { return cohorts; }
    public List<LecturerSummaryDto> getStudents() { return students; }
}
