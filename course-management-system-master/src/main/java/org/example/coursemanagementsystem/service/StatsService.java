package org.example.coursemanagementsystem.service;

import org.example.coursemanagementsystem.dto.ProgramCourseCountDto;
import org.example.coursemanagementsystem.dto.SectionTypeCountDto;
import org.example.coursemanagementsystem.dto.TeachingLoadDto;
import org.example.coursemanagementsystem.entity.Section;
import org.example.coursemanagementsystem.entity.StudyProgram;
import org.example.coursemanagementsystem.entity.User;
import org.example.coursemanagementsystem.entity.enums.SectionType;
import org.example.coursemanagementsystem.repository.ActiveCourseRepository;
import org.example.coursemanagementsystem.repository.SectionRepository;
import org.example.coursemanagementsystem.repository.StudyProgramRepository;
import org.example.coursemanagementsystem.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Statistiques agregees pour alimenter le dashboard (semaine 7).
 * Regroupe des donnees qui traversent plusieurs entites, d'ou un service
 * dedie plutot que de le rattacher a un seul des services existants.
 */
@Service
public class StatsService {

    // Nom de la categorie designant les enseignants dans la table de reference.
    // A garder aligne avec les donnees inserees en base (seed).
    private static final String LECTURER_CATEGORY = "LECTURER";

    private final UserRepository userRepository;
    private final SectionRepository sectionRepository;
    private final StudyProgramRepository studyProgramRepository;
    private final ActiveCourseRepository activeCourseRepository;

    public StatsService(UserRepository userRepository,
                        SectionRepository sectionRepository,
                        StudyProgramRepository studyProgramRepository,
                        ActiveCourseRepository activeCourseRepository) {
        this.userRepository = userRepository;
        this.sectionRepository = sectionRepository;
        this.studyProgramRepository = studyProgramRepository;
        this.activeCourseRepository = activeCourseRepository;
    }

    // Charge d'enseignement de TOUS les enseignants (categorie LECTURER),
    // triee par total d'heures decroissant. Ceux sans section apparaissent
    // avec 0h, utile pour reperer qui n'a rien d'assigne.
    public List<TeachingLoadDto> getTeachingLoadStats() {
        List<User> lecturers = userRepository.findByCategory_Name(LECTURER_CATEGORY);

        return lecturers.stream()
                .map(lecturer -> {
                    List<Section> sections = sectionRepository.findByLecturer_Id(lecturer.getId());
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
                })
                .sorted((a, b) -> Integer.compare(b.getTotalHours(), a.getTotalHours()))
                .toList();
    }

    // Nombre de cours actifs par programme d'etudes (toutes annees confondues).
    public List<ProgramCourseCountDto> getCoursesPerProgramStats() {
        List<StudyProgram> programs = studyProgramRepository.findAll();

        return programs.stream()
                .map(program -> new ProgramCourseCountDto(
                        program.getId(),
                        program.getName(),
                        activeCourseRepository.findByStudyProgram_Id(program.getId()).size()
                ))
                .toList();
    }

    // Repartition des sections par type (THEORY / LAB / SEMINAR).
    public List<SectionTypeCountDto> getSectionsPerTypeStats() {
        Map<SectionType, Long> counts = sectionRepository.findAll().stream()
                .collect(Collectors.groupingBy(Section::getType, Collectors.counting()));

        return counts.entrySet().stream()
                .map(e -> new SectionTypeCountDto(e.getKey(), e.getValue()))
                .toList();
    }
}
