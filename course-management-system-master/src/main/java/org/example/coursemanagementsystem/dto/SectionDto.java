package org.example.coursemanagementsystem.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;
import org.example.coursemanagementsystem.entity.enums.SectionType;

import java.time.DayOfWeek;
import java.time.LocalTime;

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

    @NotNull(message = "capacity is required")
    @Positive(message = "capacity must be positive")
    private Integer capacity;

    @NotBlank(message = "room is required")
    private String room;

    @NotNull(message = "dayOfWeek is required")
    private DayOfWeek dayOfWeek;

    @NotNull(message = "startTime is required")
    private LocalTime startTime;

    @NotNull(message = "endTime is required")
    private LocalTime endTime;
}
