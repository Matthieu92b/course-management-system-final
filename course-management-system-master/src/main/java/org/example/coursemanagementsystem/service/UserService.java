package org.example.coursemanagementsystem.service;

import org.example.coursemanagementsystem.dto.TeachingLoadDto;
import org.example.coursemanagementsystem.dto.UserDto;
import org.example.coursemanagementsystem.entity.Category;
import org.example.coursemanagementsystem.entity.Cohort;
import org.example.coursemanagementsystem.entity.Section;
import org.example.coursemanagementsystem.entity.User;
import org.example.coursemanagementsystem.exception.DuplicateResourceException;
import org.example.coursemanagementsystem.exception.InvalidRequestException;
import org.example.coursemanagementsystem.exception.ResourceNotFoundException;
import org.example.coursemanagementsystem.repository.CategoryRepository;
import org.example.coursemanagementsystem.repository.CohortRepository;
import org.example.coursemanagementsystem.repository.SectionRepository;
import org.example.coursemanagementsystem.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private static final String STUDENT_CATEGORY = "STUDENT";

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final SectionRepository sectionRepository;
    private final CohortRepository cohortRepository;

    public UserService(UserRepository userRepository,
                       CategoryRepository categoryRepository,
                       SectionRepository sectionRepository,
                       CohortRepository cohortRepository) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.sectionRepository = sectionRepository;
        this.cohortRepository = cohortRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));
    }

    public User createUser(UserDto dto) {
        ensureEmailIsAvailable(dto.getEmail(), null);
        Category category = getCategory(dto.getCategoryId());

        User user = new User();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setCategory(category);
        user.setCohort(resolveCohort(category, dto.getCohortId()));

        return userRepository.save(user);
    }

    public User updateUser(long id, UserDto dto) {
        User user = getUserById(id);
        ensureEmailIsAvailable(dto.getEmail(), id);
        Category category = getCategory(dto.getCategoryId());

        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setCategory(category);
        user.setCohort(resolveCohort(category, dto.getCohortId()));

        return userRepository.save(user);
    }

    public void deleteUser(long id) {
        userRepository.delete(getUserById(id));
    }

    // Fonctionnalite metier (semaine 6) : charge d'enseignement d'un enseignant.
    // Depuis la refacto, la relation est directe : Section.lecturer -> User,
    // donc on interroge simplement les sections dont il est l'enseignant.
    public TeachingLoadDto getTeachingLoad(long lecturerId) {
        User lecturer = getUserById(lecturerId);

        List<Section> sections = sectionRepository.findByLecturer_Id(lecturerId);

        int totalHours = sections.stream()
                .mapToInt(Section::getHours)
                .sum();

        return new TeachingLoadDto(
                lecturer.getId(),
                lecturer.getFirstName(),
                lecturer.getLastName(),
                sections.size(),
                totalHours
        );
    }

    private Category getCategory(Integer categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id " + categoryId));
    }

    // Chaque etudiant doit etre rattache a une cohorte/classe ; les autres
    // categories (ADMIN, LECTURER, ...) n'en ont pas, meme si un cohortId
    // perime trainait sur le DTO (ex: changement de categorie).
    private Cohort resolveCohort(Category category, Integer cohortId) {
        boolean isStudent = STUDENT_CATEGORY.equalsIgnoreCase(category.getName());

        if (!isStudent) {
            return null;
        }

        if (cohortId == null) {
            throw new InvalidRequestException("cohortId is required for STUDENT users");
        }

        return cohortRepository.findById(cohortId)
                .orElseThrow(() -> new ResourceNotFoundException("Cohort not found with id " + cohortId));
    }

    // L'email doit etre unique : on verifie explicitement plutot que de laisser
    // remonter une erreur SQL brute (excludeId sert a s'autoriser sa propre valeur en update).
    private void ensureEmailIsAvailable(String email, Long excludeId) {
        userRepository.findByEmail(email).ifPresent(existing -> {
            if (excludeId == null || existing.getId() != excludeId) {
                throw new DuplicateResourceException("Email already in use: " + email);
            }
        });
    }
}
