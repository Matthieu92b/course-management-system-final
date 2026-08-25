import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FacultiesComponent } from './pages/faculties/faculties.component';
import { DepartmentsComponent } from './pages/departments/departments.component';
import { StudyProgramsComponent } from './pages/study-programs/study-programs.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { ActiveCoursesComponent } from './pages/active-courses/active-courses.component';
import { SectionsComponent } from './pages/sections/sections.component';
import { UsersComponent } from './pages/users/users.component';
import { CategoriesComponent } from './pages/categories/categories.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'faculties', component: FacultiesComponent },
  { path: 'departments', component: DepartmentsComponent },
  { path: 'study-programs', component: StudyProgramsComponent },
  { path: 'courses', component: CoursesComponent },
  { path: 'active-courses', component: ActiveCoursesComponent },
  { path: 'sections', component: SectionsComponent },
  { path: 'users', component: UsersComponent },
  { path: 'categories', component: CategoriesComponent }
];
