package org.example.coursemanagementsystem.dto;

import org.example.coursemanagementsystem.entity.enums.Typology;

/**
 * Cours actif dans le contexte d'un StudyProgram : renvoye par
 * GET /study-programs/{id}/courses.
 */
public class ActiveCourseSummaryDto {

    private Integer activeCourseId;
    private Integer courseId;
    private String code;
    private String title;
    private Integer credits;
    private Integer academicYear;
    private Integer semester;
    private Typology typology;

    public ActiveCourseSummaryDto(Integer activeCourseId, Integer courseId, String code, String title,
                                   Integer credits, Integer academicYear, Integer semester, Typology typology) {
        this.activeCourseId = activeCourseId;
        this.courseId = courseId;
        this.code = code;
        this.title = title;
        this.credits = credits;
        this.academicYear = academicYear;
        this.semester = semester;
        this.typology = typology;
    }

    public Integer getActiveCourseId() { return activeCourseId; }
    public Integer getCourseId() { return courseId; }
    public String getCode() { return code; }
    public String getTitle() { return title; }
    public Integer getCredits() { return credits; }
    public Integer getAcademicYear() { return academicYear; }
    public Integer getSemester() { return semester; }
    public Typology getTypology() { return typology; }
}
