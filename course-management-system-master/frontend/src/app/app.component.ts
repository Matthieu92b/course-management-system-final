import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="layout">
      <aside class="sidebar">
        <h1>Course Management</h1>
        <nav>
          <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
          <a routerLink="/faculties" routerLinkActive="active">Faculties</a>
          <a routerLink="/departments" routerLinkActive="active">Departments</a>
          <a routerLink="/study-programs" routerLinkActive="active">Study Programs</a>
          <a routerLink="/courses" routerLinkActive="active">Courses</a>
          <a routerLink="/active-courses" routerLinkActive="active">Active Courses</a>
          <a routerLink="/sections" routerLinkActive="active">Sections</a>
          <a routerLink="/users" routerLinkActive="active">Users</a>
          <a routerLink="/categories" routerLinkActive="active">Categories</a>
        </nav>
      </aside>
      <main class="content">
        <router-outlet />
      </main>
    </div>
  `
})
export class AppComponent {}
