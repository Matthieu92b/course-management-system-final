package org.example.coursemanagementsystem.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String firstName;
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    private String password;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    // Cohorte/classe de l'etudiant. Nullable en base pour rester compatible
    // avec les users non-etudiants (ADMIN, LECTURER) ; obligatoire cote
    // service quand la categorie resolue est STUDENT.
    @ManyToOne
    @JoinColumn(name = "cohort_id")
    private Cohort cohort;
}
