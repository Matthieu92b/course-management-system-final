package org.example.coursemanagementsystem.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class AppointmentDto {

    @NotNull(message = "sectionId is required")
    private Long sectionId;

    @NotNull(message = "date is required")
    private LocalDate date;
}
