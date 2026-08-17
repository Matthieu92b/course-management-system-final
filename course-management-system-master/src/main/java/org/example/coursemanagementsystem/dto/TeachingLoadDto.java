package org.example.coursemanagementsystem.dto;

/**
 * Charge d'enseignement d'un enseignant : nombre de sections prises en
 * charge et total d'heures cumulees sur ces sections.
 */
public class TeachingLoadDto {

    private long lecturerId;
    private String firstName;
    private String lastName;
    private int sectionsCount;
    private int totalHours;

    public TeachingLoadDto(long lecturerId, String firstName, String lastName, int sectionsCount, int totalHours) {
        this.lecturerId = lecturerId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.sectionsCount = sectionsCount;
        this.totalHours = totalHours;
    }

    public long getLecturerId() { return lecturerId; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public int getSectionsCount() { return sectionsCount; }
    public int getTotalHours() { return totalHours; }
}
