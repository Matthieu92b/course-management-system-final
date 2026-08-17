package org.example.coursemanagementsystem.service;

import org.example.coursemanagementsystem.dto.CategoryDto;
import org.example.coursemanagementsystem.entity.Category;
import org.example.coursemanagementsystem.exception.DuplicateResourceException;
import org.example.coursemanagementsystem.exception.ResourceNotFoundException;
import org.example.coursemanagementsystem.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(Integer id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id " + id));
    }

    public Category createCategory(CategoryDto dto) {
        categoryRepository.findByName(dto.getName()).ifPresent(existing -> {
            throw new DuplicateResourceException("Category already exists: " + dto.getName());
        });

        Category category = new Category();
        category.setName(dto.getName());
        return categoryRepository.save(category);
    }

    public Category updateCategory(Integer id, CategoryDto dto) {
        Category category = getCategoryById(id);
        category.setName(dto.getName());
        return categoryRepository.save(category);
    }

    public void deleteCategory(Integer id) {
        categoryRepository.delete(getCategoryById(id));
    }
}
