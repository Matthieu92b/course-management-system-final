package org.example.coursemanagementsystem.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;
import org.example.coursemanagementsystem.entity.enums.Typology;

@Getter
@Setter
public class ActiveCourseDto {

    @NotNull(message = "studyProgramId is required")
    private Integer studyProgramId;

    @NotNull(message = "courseId is required")
    private Integer courseId;

    // annee simple (ex: 2026), convertie en java.time.Year cote service
    @NotNull(message = "academicYear is required")
    @Positive(message = "academicYear must be a positive year")
    private Integer academicYear;

    @NotNull(message = "semester is required")
    @Positive(message = "semester must be positive")
    private Integer semester;

    @NotNull(message = "typology is required (A, B, C, D or E)")
    private Typology typology;
}
