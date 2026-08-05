package org.example.coursemanagementsystem.service;

import org.example.coursemanagementsystem.exception.ResourceNotFoundException;
import org.example.coursemanagementsystem.dto.DepartmentDto;
import org.example.coursemanagementsystem.entity.Department;
import org.example.coursemanagementsystem.entity.Faculty;
import org.example.coursemanagementsystem.repository.DepartmentRepository;
import org.example.coursemanagementsystem.repository.FacultyRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final FacultyRepository facultyRepository;

    public DepartmentService(DepartmentRepository departmentRepository,
                             FacultyRepository facultyRepository) {
        this.departmentRepository = departmentRepository;
        this.facultyRepository = facultyRepository;
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Department createDepartment(DepartmentDto departmentDto) {

        Faculty faculty = facultyRepository.findById(departmentDto.getFacultyId())
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with id " + departmentDto.getFacultyId()));

        Department department = new Department();
        department.setName(departmentDto.getName());
        department.setFaculty(faculty);

        return departmentRepository.save(department);
    }
    public Department getDepartmentById(int id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
    }

    public Department updateDepartment(int id, DepartmentDto dto) {
        Department department = getDepartmentById(id);
        Faculty faculty = facultyRepository.findById(dto.getFacultyId())
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found"));

        department.setName(dto.getName());
        department.setFaculty(faculty);

        return departmentRepository.save(department);
    }

    public void deleteDepartment(int id) {
        departmentRepository.delete(getDepartmentById(id));
    }
}