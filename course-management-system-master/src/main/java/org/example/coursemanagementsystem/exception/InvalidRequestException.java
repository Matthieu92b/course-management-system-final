package org.example.coursemanagementsystem.exception;

// Erreur de validation metier qui depend de plusieurs champs et ne peut donc
// pas etre exprimee par une simple annotation Bean Validation sur le DTO
// (ex: cohortId requis seulement quand la categorie resolue est STUDENT).
public class InvalidRequestException extends RuntimeException {

    public InvalidRequestException(String message) {
        super(message);
    }
}
