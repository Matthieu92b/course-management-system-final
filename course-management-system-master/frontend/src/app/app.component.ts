import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from './components/icon/icon.component';
import { ToastContainerComponent } from './components/toast/toast-container.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { LoadingBarComponent } from './components/loading-bar/loading-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, RouterLink, RouterLinkActive,
    IconComponent, ToastContainerComponent, ConfirmDialogComponent, LoadingBarComponent
  ],
  template: `
    <app-loading-bar></app-loading-bar>
    <div class="layout">
      <aside class="sidebar">
        <h1><app-icon name="dashboard" [size]="18"></app-icon> Course Management</h1>
        <nav>
          <a routerLink="/dashboard" routerLinkActive="active"><app-icon name="dashboard"></app-icon> Dashboard</a>
          <a routerLink="/faculties" routerLinkActive="active"><app-icon name="faculty"></app-icon> Faculties</a>
          <a routerLink="/departments" routerLinkActive="active"><app-icon name="department"></app-icon> Departments</a>
          <a routerLink="/study-programs" routerLinkActive="active"><app-icon name="program"></app-icon> Study Programs</a>
          <a routerLink="/courses" routerLinkActive="active"><app-icon name="course"></app-icon> Courses</a>
          <a routerLink="/active-courses" routerLinkActive="active"><app-icon name="activeCourse"></app-icon> Active Courses</a>
          <a routerLink="/sections" routerLinkActive="active"><app-icon name="section"></app-icon> Sections</a>
          <a routerLink="/users" routerLinkActive="active"><app-icon name="users"></app-icon> Users</a>
          <a routerLink="/categories" routerLinkActive="active"><app-icon name="category"></app-icon> Categories</a>
        </nav>
      </aside>
      <main class="content">
        <router-outlet />
      </main>
    </div>
    <app-toast-container></app-toast-container>
    <app-confirm-dialog></app-confirm-dialog>
  `
})
export class AppComponent {}
