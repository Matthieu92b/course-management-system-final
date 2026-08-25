import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FacultiesComponent } from './pages/faculties/faculties.component';
import { DepartmentsComponent } from './pages/departments/departments.component';
import { StudyProgramsComponent } from './pages/study-programs/study-programs.component';
import { StudyProgramDetailComponent } from './pages/study-program-detail/study-program-detail.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { ActiveCoursesComponent } from './pages/active-courses/active-courses.component';
import { SectionsComponent } from './pages/sections/sections.component';
import { UsersComponent } from './pages/users/users.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { CohortsComponent } from './pages/cohorts/cohorts.component';
import { AppointmentsComponent } from './pages/appointments/appointments.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { authGuard, adminGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, canActivate: [adminGuard] },
      { path: 'faculties', component: FacultiesComponent, canActivate: [adminGuard] },
      { path: 'departments', component: DepartmentsComponent, canActivate: [adminGuard] },
      { path: 'study-programs', component: StudyProgramsComponent, canActivate: [adminGuard] },
      { path: 'study-programs/:id', component: StudyProgramDetailComponent, canActivate: [adminGuard] },
      { path: 'courses', component: CoursesComponent, canActivate: [adminGuard] },
      { path: 'active-courses', component: ActiveCoursesComponent, canActivate: [adminGuard] },
      { path: 'sections', component: SectionsComponent, canActivate: [adminGuard] },
      { path: 'appointments', component: AppointmentsComponent, canActivate: [adminGuard] },
      { path: 'cohorts', component: CohortsComponent, canActivate: [adminGuard] },
      { path: 'users', component: UsersComponent, canActivate: [adminGuard] },
      { path: 'categories', component: CategoriesComponent, canActivate: [adminGuard] },
      { path: 'schedule', component: ScheduleComponent }
    ]
  }
];
