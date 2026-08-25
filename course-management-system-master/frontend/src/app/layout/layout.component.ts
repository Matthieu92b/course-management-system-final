import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IconComponent } from '../components/icon/icon.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, IconComponent],
  template: `
    <div class="layout">
      <aside class="sidebar">
        <h1><app-icon name="dashboard" [size]="18"></app-icon> Course Management</h1>

        <div class="sidebar-user" *ngIf="auth.currentUser() as user">
          <div class="name">{{ user.firstName }} {{ user.lastName }}</div>
          <div class="role">{{ user.role }}</div>
        </div>

        <nav>
          <ng-container *ngIf="auth.isAdmin()">
            <a routerLink="/dashboard" routerLinkActive="active"><app-icon name="dashboard"></app-icon> Dashboard</a>
            <a routerLink="/faculties" routerLinkActive="active"><app-icon name="faculty"></app-icon> Faculties</a>
            <a routerLink="/departments" routerLinkActive="active"><app-icon name="department"></app-icon> Departments</a>
            <a routerLink="/study-programs" routerLinkActive="active"><app-icon name="program"></app-icon> Study Programs</a>
            <a routerLink="/courses" routerLinkActive="active"><app-icon name="course"></app-icon> Courses</a>
            <a routerLink="/active-courses" routerLinkActive="active"><app-icon name="activeCourse"></app-icon> Active Courses</a>
            <a routerLink="/sections" routerLinkActive="active"><app-icon name="section"></app-icon> Sections</a>
            <a routerLink="/appointments" routerLinkActive="active"><app-icon name="calendar"></app-icon> Appointments</a>
            <a routerLink="/cohorts" routerLinkActive="active"><app-icon name="cohort"></app-icon> Cohorts</a>
            <a routerLink="/users" routerLinkActive="active"><app-icon name="users"></app-icon> Users</a>
            <a routerLink="/categories" routerLinkActive="active"><app-icon name="category"></app-icon> Categories</a>
          </ng-container>

          <ng-container *ngIf="!auth.isAdmin()">
            <a routerLink="/schedule" routerLinkActive="active"><app-icon name="calendar"></app-icon> My Schedule</a>
          </ng-container>

          <button class="sidebar-logout" type="button" (click)="logout()">
            <app-icon name="logout"></app-icon> Log out
          </button>
        </nav>
      </aside>
      <main class="content">
        <router-outlet />
      </main>
    </div>
  `
})
export class LayoutComponent {
  constructor(public auth: AuthService, private router: Router) {}

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
