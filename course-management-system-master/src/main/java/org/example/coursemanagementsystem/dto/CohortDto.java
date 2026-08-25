package org.example.coursemanagementsystem.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CohortDto {

    @NotBlank(message = "name is required")
    private String name;

    @NotNull(message = "studyProgramId is required")
    private Integer studyProgramId;

    @NotNull(message = "academicYear is required")
    @Positive(message = "academicYear must be a positive year")
    private Integer academicYear;
}
