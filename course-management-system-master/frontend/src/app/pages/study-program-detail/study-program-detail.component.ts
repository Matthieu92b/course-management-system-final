import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { StudyProgramDetail } from '../../models/models';
import { ToastService } from '../../services/toast.service';
import { IconComponent } from '../../components/icon/icon.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';

@Component({
  selector: 'app-study-program-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent, SpinnerComponent],
  template: `
    <div class="spinner-wrap" *ngIf="loading"><app-spinner></app-spinner></div>

    <ng-container *ngIf="!loading && detail as d">
      <div class="breadcrumb">
        <a routerLink="/study-programs">Study Programs</a>
        <app-icon name="chevronRight" [size]="12"></app-icon>
        <span>{{ d.name }}</span>
      </div>
      <div class="page-header">
        <h2><app-icon name="program" [size]="20"></app-icon> {{ d.name }} ({{ d.level }})</h2>
        <a class="btn btn-secondary" routerLink="/study-programs"><app-icon name="chevronLeft" [size]="13"></app-icon> Back to list</a>
      </div>

      <div class="detail-grid">
        <div class="detail-meta-card">
          <div class="label">Faculty</div>
          <div class="value"><app-icon name="faculty" [size]="16"></app-icon> {{ d.facultyName }}</div>
        </div>
        <div class="detail-meta-card">
          <div class="label">Department</div>
          <div class="value"><app-icon name="department" [size]="16"></app-icon> {{ d.departmentName }}</div>
        </div>
        <div class="detail-meta-card">
          <div class="label">Active courses</div>
          <div class="value">{{ d.activeCourses.length }}</div>
        </div>
        <div class="detail-meta-card">
          <div class="label">Lecturers involved</div>
          <div class="value">{{ d.lecturers.length }}</div>
        </div>
      </div>

      <div class="card">
        <h3>Active courses</h3>
        <table *ngIf="d.activeCourses.length; else noCourses">
          <thead><tr><th>Code</th><th>Title</th><th>Credits</th><th>Year</th><th>Semester</th><th>Typology</th></tr></thead>
          <tbody>
            <tr *ngFor="let c of d.activeCourses">
              <td>{{ c.code }}</td>
              <td>{{ c.title }}</td>
              <td>{{ c.credits }}</td>
              <td>{{ c.academicYear }}</td>
              <td>{{ c.semester }}</td>
              <td>{{ c.typology }}</td>
            </tr>
          </tbody>
        </table>
        <ng-template #noCourses><p class="empty-state">No active courses for this program.</p></ng-template>
      </div>

      <div class="card">
        <h3>Sections</h3>
        <table *ngIf="d.sections.length; else noSections">
          <thead><tr><th>Course</th><th>Type</th><th>Hours</th><th>Room</th><th>Capacity</th><th>Schedule</th><th>Lecturer</th></tr></thead>
          <tbody>
            <tr *ngFor="let s of d.sections">
              <td>{{ s.courseCode }}</td>
              <td>{{ s.type }}</td>
              <td>{{ s.hours }}</td>
              <td>{{ s.room || '—' }}</td>
              <td>{{ s.capacity ?? '—' }}</td>
              <td>{{ s.dayOfWeek ? (s.dayOfWeek + ' ' + s.startTime + '-' + s.endTime) : '—' }}</td>
              <td>{{ s.lecturerName }}</td>
            </tr>
          </tbody>
        </table>
        <ng-template #noSections><p class="empty-state">No sections for this program yet.</p></ng-template>
      </div>

      <div class="card">
        <h3>Lecturers</h3>
        <table *ngIf="d.lecturers.length; else noLecturers">
          <thead><tr><th>Name</th><th>Email</th></tr></thead>
          <tbody>
            <tr *ngFor="let l of d.lecturers">
              <td>{{ l.firstName }} {{ l.lastName }}</td>
              <td>{{ l.email }}</td>
            </tr>
          </tbody>
        </table>
        <ng-template #noLecturers><p class="empty-state">No lecturers assigned yet.</p></ng-template>
      </div>
    </ng-container>
  `
})
export class StudyProgramDetailComponent implements OnInit {
  detail: StudyProgramDetail | null = null;
  loading = true;

  constructor(private route: ActivatedRoute, private api: ApiService, private toast: ToastService) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getStudyProgramDetail(id).subscribe({
      next: data => { this.detail = data; this.loading = false; },
      error: () => { this.loading = false; this.toast.error('Failed to load study program details'); }
    });
  }
}
