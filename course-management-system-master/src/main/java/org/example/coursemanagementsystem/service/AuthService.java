package org.example.coursemanagementsystem.service;

import org.example.coursemanagementsystem.dto.LoginRequestDto;
import org.example.coursemanagementsystem.dto.LoginResponseDto;
import org.example.coursemanagementsystem.entity.Cohort;
import org.example.coursemanagementsystem.entity.User;
import org.example.coursemanagementsystem.exception.InvalidCredentialsException;
import org.example.coursemanagementsystem.repository.UserRepository;
import org.springframework.stereotype.Service;

/**
 * Authentification volontairement simple (pas de hash, pas de session/jeton) :
 * le frontend garde l'utilisateur retourne en memoire pour adapter la
 * navigation selon son role (ADMIN / LECTURER / STUDENT, porte par
 * User.category.name comme dans le reste de l'application).
 */
@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public LoginResponseDto login(LoginRequestDto dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!user.getPassword().equals(dto.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        Cohort cohort = user.getCohort();

        return new LoginResponseDto(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getCategory().getName(),
                cohort != null ? cohort.getId() : null,
                cohort != null ? cohort.getName() : null
        );
    }
}
