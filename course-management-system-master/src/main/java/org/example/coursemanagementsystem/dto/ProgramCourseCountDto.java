package org.example.coursemanagementsystem.dto;

/**
 * Nombre de cours actifs par programme d'etudes, exploitable directement
 * pour un graphe cote frontend.
 */
public class ProgramCourseCountDto {

    private Integer studyProgramId;
    private String studyProgramName;
    private long activeCourseCount;

    public ProgramCourseCountDto(Integer studyProgramId, String studyProgramName, long activeCourseCount) {
        this.studyProgramId = studyProgramId;
        this.studyProgramName = studyProgramName;
        this.activeCourseCount = activeCourseCount;
    }

    public Integer getStudyProgramId() { return studyProgramId; }
    public String getStudyProgramName() { return studyProgramName; }
    public long getActiveCourseCount() { return activeCourseCount; }
}
