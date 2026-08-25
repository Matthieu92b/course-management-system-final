package org.example.coursemanagementsystem.dto;

import org.example.coursemanagementsystem.entity.enums.SectionType;

/**
 * Section dans le contexte d'une fiche detail (programme d'etudes, etc.).
 */
public class SectionSummaryDto {

    private Long id;
    private SectionType type;
    private Integer hours;
    private String courseCode;
    private String courseTitle;
    private Integer academicYear;
    private Integer semester;
    private Integer capacity;
    private String room;
    private String dayOfWeek;
    private String startTime;
    private String endTime;
    private Long lecturerId;
    private String lecturerName;

    public SectionSummaryDto(Long id, SectionType type, Integer hours, String courseCode, String courseTitle,
                              Integer academicYear, Integer semester, Integer capacity, String room,
                              String dayOfWeek, String startTime, String endTime,
                              Long lecturerId, String lecturerName) {
        this.id = id;
        this.type = type;
        this.hours = hours;
        this.courseCode = courseCode;
        this.courseTitle = courseTitle;
        this.academicYear = academicYear;
        this.semester = semester;
        this.capacity = capacity;
        this.room = room;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
        this.lecturerId = lecturerId;
        this.lecturerName = lecturerName;
    }

    public Long getId() { return id; }
    public SectionType getType() { return type; }
    public Integer getHours() { return hours; }
    public String getCourseCode() { return courseCode; }
    public String getCourseTitle() { return courseTitle; }
    public Integer getAcademicYear() { return academicYear; }
    public Integer getSemester() { return semester; }
    public Integer getCapacity() { return capacity; }
    public String getRoom() { return room; }
    public String getDayOfWeek() { return dayOfWeek; }
    public String getStartTime() { return startTime; }
    public String getEndTime() { return endTime; }
    public Long getLecturerId() { return lecturerId; }
    public String getLecturerName() { return lecturerName; }
}
