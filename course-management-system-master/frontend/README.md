# Course Management System - Frontend (Angular)

## Prerequisites
- Node.js 18+
- Backend Spring Boot running on http://localhost:8080

## Install & run

```bash
npm install
npm start
```

The app runs on http://localhost:4200 (CORS is already allowed by the backend's WebConfig).

## Structure

- `src/app/services/api.service.ts` - all HTTP calls to the backend
- `src/app/models/models.ts` - TypeScript interfaces mirroring the backend entities/DTOs
- `src/app/pages/` - one standalone component per screen:
  - dashboard (charts: teaching load, courses per program, sections per type)
  - faculties, departments, study-programs, courses, categories (CRUD)
  - active-courses (program <-> course assignments with year/semester/typology)
  - sections (assignment of a lecturer + active course)
  - users (CRUD + teaching workload view)
