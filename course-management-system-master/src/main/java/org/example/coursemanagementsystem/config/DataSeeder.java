package org.example.coursemanagementsystem.config;

import org.example.coursemanagementsystem.entity.Category;
import org.example.coursemanagementsystem.repository.CategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Insere les categories de base (ADMIN, LECTURER, STUDENT) au demarrage
 * si elles n'existent pas deja. Remplace les anciennes valeurs du enum
 * UserRole par des lignes de la table de reference.
 */
@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedCategories(CategoryRepository categoryRepository) {
        return args -> {
            for (String name : List.of("ADMIN", "LECTURER", "STUDENT")) {
                if (categoryRepository.findByName(name).isEmpty()) {
                    Category category = new Category();
                    category.setName(name);
                    categoryRepository.save(category);
                }
            }
        };
    }
}
