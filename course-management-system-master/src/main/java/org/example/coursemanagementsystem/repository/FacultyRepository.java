package org.example.coursemanagementsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.example.coursemanagementsystem.entity.Faculty;
public interface FacultyRepository extends JpaRepository<Faculty,Integer> {
}
