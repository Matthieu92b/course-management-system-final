package org.example.coursemanagementsystem.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SectionCohortDto {

    @NotNull(message = "cohortId is required")
    private Integer cohortId;
}
