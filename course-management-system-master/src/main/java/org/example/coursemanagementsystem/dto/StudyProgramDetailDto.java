package org.example.coursemanagementsystem.dto;

import java.util.List;

/**
 * Fiche complete d'un programme d'etudes : departement/faculte parents,
 * cours actifs, sections et enseignants qui y interviennent.
 * Sert la page de detail cote frontend (clic sur un programme).
 */
public class StudyProgramDetailDto {

    private Integer id;
    private String name;
    private String level;
    private Integer departmentId;
    private String departmentName;
    private Integer facultyId;
    private String facultyName;
    private List<ActiveCourseSummaryDto> activeCourses;
    private List<SectionSummaryDto> sections;
    private List<LecturerSummaryDto> lecturers;

    public StudyProgramDetailDto(Integer id, String name, String level,
                                  Integer departmentId, String departmentName,
                                  Integer facultyId, String facultyName,
                                  List<ActiveCourseSummaryDto> activeCourses,
                                  List<SectionSummaryDto> sections,
                                  List<LecturerSummaryDto> lecturers) {
        this.id = id;
        this.name = name;
        this.level = level;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.facultyId = facultyId;
        this.facultyName = facultyName;
        this.activeCourses = activeCourses;
        this.sections = sections;
        this.lecturers = lecturers;
    }

    public Integer getId() { return id; }
    public String getName() { return name; }
    public String getLevel() { return level; }
    public Integer getDepartmentId() { return departmentId; }
    public String getDepartmentName() { return departmentName; }
    public Integer getFacultyId() { return facultyId; }
    public String getFacultyName() { return facultyName; }
    public List<ActiveCourseSummaryDto> getActiveCourses() { return activeCourses; }
    public List<SectionSummaryDto> getSections() { return sections; }
    public List<LecturerSummaryDto> getLecturers() { return lecturers; }
}
