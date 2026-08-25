package org.example.coursemanagementsystem.service;

import org.example.coursemanagementsystem.dto.ProgramCourseCountDto;
import org.example.coursemanagementsystem.dto.SectionTypeCountDto;
import org.example.coursemanagementsystem.dto.TeachingLoadDto;
import org.example.coursemanagementsystem.entity.ActiveCourse;
import org.example.coursemanagementsystem.entity.Section;
import org.example.coursemanagementsystem.entity.StudyProgram;
import org.example.coursemanagementsystem.entity.User;
import org.example.coursemanagementsystem.entity.enums.SectionType;
import org.example.coursemanagementsystem.repository.ActiveCourseRepository;
import org.example.coursemanagementsystem.repository.SectionRepository;
import org.example.coursemanagementsystem.repository.StudyProgramRepository;
import org.example.coursemanagementsystem.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
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
    // academicYear/semester optionnels : restreignent le calcul a une periode.
    public List<TeachingLoadDto> getTeachingLoadStats(Integer academicYear, Integer semester) {
        List<User> lecturers = userRepository.findByCategory_Name(LECTURER_CATEGORY);

        return lecturers.stream()
                .map(lecturer -> {
                    List<Section> sections = sectionRepository.findByLecturer_Id(lecturer.getId()).stream()
                            .filter(s -> matchesTerm(s.getActiveCourse(), academicYear, semester))
                            .toList();
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

    // Nombre de cours actifs par programme d'etudes.
    // academicYear/semester optionnels : restreignent le calcul a une periode.
    public List<ProgramCourseCountDto> getCoursesPerProgramStats(Integer academicYear, Integer semester) {
        List<StudyProgram> programs = studyProgramRepository.findAll();

        return programs.stream()
                .map(program -> {
                    long count = activeCourseRepository.findByStudyProgram_Id(program.getId()).stream()
                            .filter(ac -> matchesTerm(ac, academicYear, semester))
                            .count();
                    return new ProgramCourseCountDto(program.getId(), program.getName(), (int) count);
                })
                .toList();
    }

    // Repartition des sections par type (THEORY / LAB / SEMINAR).
    // academicYear/semester optionnels : restreignent le calcul a une periode.
    public List<SectionTypeCountDto> getSectionsPerTypeStats(Integer academicYear, Integer semester) {
        Map<SectionType, Long> counts = sectionRepository.findAll().stream()
                .filter(s -> matchesTerm(s.getActiveCourse(), academicYear, semester))
                .collect(Collectors.groupingBy(Section::getType, Collectors.counting()));

        return counts.entrySet().stream()
                .map(e -> new SectionTypeCountDto(e.getKey(), e.getValue()))
                .toList();
    }

    // Annees academiques distinctes presentes dans les cours actifs, triees.
    // Sert a peupler les filtres front (dashboard, comparateur d'annees).
    public List<Integer> getDistinctAcademicYears() {
        return activeCourseRepository.findAll().stream()
                .map(ac -> ac.getAcademicYear().getValue())
                .distinct()
                .sorted()
                .toList();
    }

    public byte[] exportTeachingLoadCsv(Integer academicYear, Integer semester) {
        StringBuilder sb = new StringBuilder("Lecturer ID,First Name,Last Name,Sections Count,Total Hours\n");
        for (TeachingLoadDto row : getTeachingLoadStats(academicYear, semester)) {
            sb.append(row.getLecturerId()).append(',')
                    .append(csvEscape(row.getFirstName())).append(',')
                    .append(csvEscape(row.getLastName())).append(',')
                    .append(row.getSectionsCount()).append(',')
                    .append(row.getTotalHours()).append('\n');
        }
        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    public byte[] exportCoursesPerProgramCsv(Integer academicYear, Integer semester) {
        StringBuilder sb = new StringBuilder("Study Program ID,Study Program Name,Active Course Count\n");
        for (ProgramCourseCountDto row : getCoursesPerProgramStats(academicYear, semester)) {
            sb.append(row.getStudyProgramId()).append(',')
                    .append(csvEscape(row.getStudyProgramName())).append(',')
                    .append(row.getActiveCourseCount()).append('\n');
        }
        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    private boolean matchesTerm(ActiveCourse ac, Integer academicYear, Integer semester) {
        if (ac == null) {
            return false;
        }
        if (academicYear != null && ac.getAcademicYear().getValue() != academicYear) {
            return false;
        }
        return semester == null || semester.equals(ac.getSemester());
    }

    private String csvEscape(String value) {
        if (value == null) {
            return "";
        }
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }
}
