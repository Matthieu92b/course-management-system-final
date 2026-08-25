package org.example.coursemanagementsystem.dto;

/**
 * Utilisateur authentifie, renvoye au frontend qui le garde en memoire pour
 * adapter la navigation (ADMIN / LECTURER / STUDENT). Pas de session/jeton :
 * l'authentification de cette application reste volontairement simple.
 */
public class LoginResponseDto {

    private long id;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private Integer cohortId;
    private String cohortName;

    public LoginResponseDto(long id, String firstName, String lastName, String email, String role,
                             Integer cohortId, String cohortName) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
        this.cohortId = cohortId;
        this.cohortName = cohortName;
    }

    public long getId() { return id; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public Integer getCohortId() { return cohortId; }
    public String getCohortName() { return cohortName; }
}
