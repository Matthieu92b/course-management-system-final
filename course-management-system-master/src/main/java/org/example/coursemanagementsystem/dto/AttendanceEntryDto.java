package org.example.coursemanagementsystem.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.example.coursemanagementsystem.entity.enums.AttendanceStatus;

@Getter
@Setter
public class AttendanceEntryDto {

    @NotNull(message = "studentId is required")
    private Long studentId;

    @NotNull(message = "status is required (PRESENT, ABSENT, LATE or EXCUSED)")
    private AttendanceStatus status;
}
