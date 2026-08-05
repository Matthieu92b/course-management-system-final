package org.example.coursemanagementsystem.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DepartmentDto {

    private Integer id;

    @NotBlank(message = "name is required")
    private String name;

    @NotNull(message = "facultyId is required")
    private Integer facultyId;

    public DepartmentDto() {
    }

    public DepartmentDto(Integer id, String name, Integer facultyId) {
        this.id = id;
        this.name = name;
        this.facultyId = facultyId;
    }
}
