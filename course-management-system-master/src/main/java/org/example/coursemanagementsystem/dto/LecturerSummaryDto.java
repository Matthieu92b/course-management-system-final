package org.example.coursemanagementsystem.dto;

public class LecturerSummaryDto {

    private long id;
    private String firstName;
    private String lastName;
    private String email;

    public LecturerSummaryDto(long id, String firstName, String lastName, String email) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }

    public long getId() { return id; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getEmail() { return email; }
}