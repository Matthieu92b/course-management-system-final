package org.example.coursemanagementsystem.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDto {

    @NotBlank(message = "firstName is required")
    private String firstName;

    @NotBlank(message = "lastName is required")
    private String lastName;

    @NotBlank(message = "email is required")
    @Email(message = "email must be a valid email address")
    private String email;

    @NotBlank(message = "password is required")
    private String password;

    @NotNull(message = "categoryId is required")
    private Integer categoryId;

    // Requis uniquement quand la categorie resolue est STUDENT (verifie
    // cote service, puisque la validation Bean Validation ne connait pas
    // encore la categorie a ce stade).
    private Integer cohortId;
}
