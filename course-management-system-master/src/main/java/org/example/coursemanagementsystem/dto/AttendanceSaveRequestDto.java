package org.example.coursemanagementsystem.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AttendanceSaveRequestDto {

    @NotEmpty(message = "entries must not be empty")
    @Valid
    private List<AttendanceEntryDto> entries;
}
