package org.example.coursemanagementsystem.entity;

import jakarta.persistence.*;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

@Entity
@Table(name="study_program")
public class StudyProgram {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;


    private String level;


    @ManyToOne
    @JoinColumn(name="department_id", nullable=false)
    private Department department;

}
