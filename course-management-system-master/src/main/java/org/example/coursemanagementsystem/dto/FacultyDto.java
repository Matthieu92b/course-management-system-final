package org.example.coursemanagementsystem.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FacultyDto {

    private Integer id;

    @NotBlank(message = "name is required")
    private String name;

    public FacultyDto() {
    }

    public FacultyDto(Integer id, String name) {
        this.id = id;
        this.name = name;
    }
}
