package org.example.coursemanagementsystem.controller;

import jakarta.validation.Valid;
import org.example.coursemanagementsystem.dto.DepartmentDto;
import org.example.coursemanagementsystem.entity.Department;
import org.example.coursemanagementsystem.service.DepartmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping
    public List<Department> getAllDepartments() {
        return departmentService.getAllDepartments();
    }

    @PostMapping
    public Department createDepartment(@Valid @RequestBody DepartmentDto departmentDto) {
        return departmentService.createDepartment(departmentDto);
    }
    @GetMapping("/{id}")
    public Department getDepartmentById(@PathVariable int id) {
        return departmentService.getDepartmentById(id);
    }

    @PutMapping("/{id}")
    public Department updateDepartment(@PathVariable int id, @Valid @RequestBody DepartmentDto dto) {
        return departmentService.updateDepartment(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteDepartment(@PathVariable int id) {
        departmentService.deleteDepartment(id);
    }
}