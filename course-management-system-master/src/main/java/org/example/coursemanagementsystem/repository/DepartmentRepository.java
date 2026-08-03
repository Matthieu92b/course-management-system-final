package org.example.coursemanagementsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.example.coursemanagementsystem.entity.Department;

public interface DepartmentRepository extends JpaRepository<Department,Integer> {
}
