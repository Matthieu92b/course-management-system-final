import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Course, Section } from '../../models/models';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header"><h2>Courses</h2></div>

    <div class="card">
      <form (ngSubmit)="save()">
        <div><label>Code</label><input [(ngModel)]="form.code" name="code" required placeholder="CS101"></div>
        <div><label>Title</label><input [(ngModel)]="form.title" name="title" required placeholder="Intro to Programming"></div>
        <div><label>Credits</label><input type="number" [(ngModel)]="form.credits" name="credits" required min="1"></div>
        <div>
          <button class="btn btn-primary" type="submit">{{ editingId ? 'Update' : 'Create' }}</button>
          <button class="btn btn-secondary" type="button" *ngIf="editingId" (click)="cancel()">Cancel</button>
        </div>
        <p class="error" *ngIf="error">{{ error }}</p>
      </form>
    </div>

    <div class="card">
      <table>
        <thead><tr><th>ID</th><th>Code</th><th>Title</th><th>Credits</th><th></th></tr></thead>
        <tbody>
          <tr *ngFor="let c of courses">
            <td>{{ c.id }}</td>
            <td>{{ c.code }}</td>
            <td>{{ c.title }}</td>
            <td>{{ c.credits }}</td>
            <td>
              <button class="btn btn-secondary" (click)="showSections(c)">Sections</button>
              <button class="btn btn-secondary" (click)="edit(c)">Edit</button>
              <button class="btn btn-danger" (click)="remove(c.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card" *ngIf="selectedCourse">
      <h3>Sections of {{ selectedCourse.code }}</h3>
      <table *ngIf="sections.length; else noSections">
        <thead><tr><th>ID</th><th>Type</th><th>Hours</th><th>Lecturer</th></tr></thead>
        <tbody>
          <tr *ngFor="let s of sections">
            <td>{{ s.id }}</td>
            <td>{{ s.type }}</td>
            <td>{{ s.hours }}</td>
            <td>{{ s.lecturer?.firstName }} {{ s.lecturer?.lastName }}</td>
          </tr>
        </tbody>
      </table>
      <ng-template #noSections><p>No sections for this course yet.</p></ng-template>
    </div>
  `
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  sections: Section[] = [];
  selectedCourse: Course | null = null;
  form = { code: '', title: '', credits: 1 };
  editingId: number | null = null;
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit() { this.load(); }
  load() { this.api.getCourses().subscribe(data => this.courses = data); }

  save() {
    this.error = '';
    const req = this.editingId
      ? this.api.updateCourse(this.editingId, this.form)
      : this.api.createCourse(this.form);
    req.subscribe({
      next: () => { this.cancel(); this.load(); },
      error: err => this.error = err.error?.message ?? 'Error'
    });
  }

  edit(c: Course) { this.editingId = c.id; this.form = { code: c.code, title: c.title, credits: c.credits }; }
  cancel() { this.editingId = null; this.form = { code: '', title: '', credits: 1 }; }

  remove(id: number) {
    if (!confirm('Delete this course?')) return;
    this.api.deleteCourse(id).subscribe({ next: () => this.load(), error: err => this.error = err.error?.message ?? 'Error' });
  }

  showSections(c: Course) {
    this.selectedCourse = c;
    this.api.getSectionsForCourse(c.id).subscribe(data => this.sections = data);
  }
}
