package org.example.coursemanagementsystem.dto;

import org.example.coursemanagementsystem.entity.enums.SectionType;

/**
 * Nombre de sections par type (THEORY / LAB / SEMINAR), pour un pie chart.
 */
public class SectionTypeCountDto {

    private SectionType type;
    private long count;

    public SectionTypeCountDto(SectionType type, long count) {
        this.type = type;
        this.count = count;
    }

    public SectionType getType() { return type; }
    public long getCount() { return count; }
}
