package org.example.coursemanagementsystem.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudyProgramDto {

    private Integer id;

    @NotBlank(message = "name is required")
    private String name;

    @NotBlank(message = "level is required")
    private String level;

    @NotNull(message = "departmentId is required")
    private Integer departmentId;

    public StudyProgramDto() {
    }

    public StudyProgramDto(Integer id, String name, String level, Integer departmentId) {
        this.id = id;
        this.name = name;
        this.level = level;
        this.departmentId = departmentId;
    }
}
