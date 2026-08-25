package org.example.coursemanagementsystem.service;

import org.example.coursemanagementsystem.exception.ResourceNotFoundException;
import org.example.coursemanagementsystem.repository.FacultyRepository;
import org.example.coursemanagementsystem.dto.FacultyDto;
import org.example.coursemanagementsystem.entity.Faculty;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FacultyService {
    private final FacultyRepository facultyRepository;

    public FacultyService(FacultyRepository facultyRepository) {
        this.facultyRepository=facultyRepository;
    }

    public List<Faculty> getAllFaculties(){
        return facultyRepository.findAll();
    }

    public Faculty createFaculty(FacultyDto facultyDto) {
        Faculty faculty = new Faculty();
        faculty.setName(facultyDto.getName());

        return facultyRepository.save(faculty);
    }

    public Faculty getFacultyById(int id) {
        return facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found"));
    }

    public Faculty updateFaculty(int id, FacultyDto facultyDto) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found"));

        faculty.setName(facultyDto.getName());

        return facultyRepository.save(faculty);
    }

    public void deleteFaculty(int id) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found"));

        facultyRepository.delete(faculty);
    }

}
