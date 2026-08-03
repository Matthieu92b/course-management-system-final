package org.example.coursemanagementsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.example.coursemanagementsystem.entity.Course;
public interface CourseRepository extends JpaRepository<Course,Integer> {
}
