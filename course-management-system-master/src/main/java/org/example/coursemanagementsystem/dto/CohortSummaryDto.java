package org.example.coursemanagementsystem.dto;

public class CohortSummaryDto {

    private Integer id;
    private String name;

    public CohortSummaryDto(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    public Integer getId() { return id; }
    public String getName() { return name; }
}
