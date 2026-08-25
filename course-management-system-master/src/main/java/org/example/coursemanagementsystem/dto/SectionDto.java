package org.example.coursemanagementsystem.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;
import org.example.coursemanagementsystem.entity.enums.SectionType;

@Getter
@Setter
public class SectionDto {

    @NotNull(message = "type is required (THEORY, LAB or SEMINAR)")
    private SectionType type;

    @NotNull(message = "hours is required")
    @Positive(message = "hours must be positive")
    private Integer hours;

    @NotNull(message = "activeCourseId is required")
    private Integer activeCourseId;

    @NotNull(message = "lecturerId is required")
    private Long lecturerId;
}
