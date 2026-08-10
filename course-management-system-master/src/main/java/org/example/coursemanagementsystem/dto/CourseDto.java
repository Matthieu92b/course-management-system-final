package org.example.coursemanagementsystem.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CourseDto {

    private Integer id;

    @NotBlank(message = "code is required")
    private String code;

    @NotBlank(message = "title is required")
    private String title;

    @NotNull(message = "credits is required")
    @Positive(message = "credits must be positive")
    private Integer credits;
}
