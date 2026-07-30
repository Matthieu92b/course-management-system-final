# Course Management System

Full-stack application to manage the academic structure of a higher-education institution:
faculties, departments, study programs, courses, sections, lecturers and their assignments.

## Stack

- **Backend**: Java 21, Spring Boot, Spring Data JPA (Hibernate), MariaDB, Maven
- **Frontend**: Angular 18 (standalone components), Chart.js
- **Tools**: Postman, DBeaver, Git/GitHub

## Data model (UML v2)

- `Faculty -> Department -> StudyProgram` (administrative hierarchy)
- `Course` linked to programs through `ActiveCourse` (year, semester, typology A-E)
- `Section` belongs to an `ActiveCourse` and has exactly one lecturer (`User`)
- `User` role handled by a `Category` lookup table (ADMIN / LECTURER / STUDENT, extensible)

## Run the backend

1. Start MariaDB and create a database matching `src/main/resources/application.properties`
2. `./mvnw spring-boot:run`
3. Base categories (ADMIN, LECTURER, STUDENT) are seeded automatically at startup

API available on http://localhost:8080

### Main endpoints

| Area | Endpoint |
|---|---|
| CRUD | `/faculties`, `/departments`, `/study-programs`, `/courses`, `/active-courses`, `/sections`, `/users`, `/categories` |
| Business | `GET /study-programs/{id}/courses`, `GET /courses/{id}/sections`, `GET /sections/{id}/lecturer`, `GET /users/{id}/teaching-load` |
| Stats | `GET /stats/teaching-load`, `GET /stats/courses-per-program`, `GET /stats/sections-per-type` |

Errors follow a uniform JSON format (`ApiError`) with proper status codes: 404 (not found), 409 (conflict/duplicate), 400 (validation with per-field details).

## Run the frontend

```bash
cd frontend
npm install
npm start
```

App on http://localhost:4200 (CORS already configured backend-side).

## Testing

Import `course-management-system-v2.postman_collection.json` into Postman and run folders 1 -> 5 in order (IDs are chained automatically between requests).
