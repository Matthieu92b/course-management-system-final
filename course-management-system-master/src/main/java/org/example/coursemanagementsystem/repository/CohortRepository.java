package org.example.coursemanagementsystem.repository;

import org.example.coursemanagementsystem.entity.Cohort;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CohortRepository extends JpaRepository<Cohort, Integer> {
}
