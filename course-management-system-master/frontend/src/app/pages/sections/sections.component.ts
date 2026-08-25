import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ActiveCourse, Section, User } from '../../models/models';

@Component({
  selector: 'app-sections',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header"><h2>Sections</h2></div>

    <div class="card">
      <form (ngSubmit)="save()">
        <div>
          <label>Type</label>
          <select [(ngModel)]="form.type" name="type" required>
            <option *ngFor="let t of types" [ngValue]="t">{{ t }}</option>
          </select>
        </div>
        <div><label>Hours</label><input type="number" [(ngModel)]="form.hours" name="hours" required min="1"></div>
        <div>
          <label>Active Course</label>
          <select [(ngModel)]="form.activeCourseId" name="activeCourseId" required>
            <option [ngValue]="0" disabled>-- select active course --</option>
            <option *ngFor="let ac of activeCourses" [ngValue]="ac.id">
              {{ ac.course?.code }} / {{ ac.studyProgram?.name }} / {{ ac.academicYear }} S{{ ac.semester }}
            </option>
          </select>
        </div>
        <div>
          <label>Lecturer</label>
          <select [(ngModel)]="form.lecturerId" name="lecturerId" required>
            <option [ngValue]="0" disabled>-- select lecturer --</option>
            <option *ngFor="let u of lecturers" [ngValue]="u.id">{{ u.firstName }} {{ u.lastName }}</option>
          </select>
        </div>
        <div>
          <button class="btn btn-primary" type="submit">{{ editingId ? 'Update' : 'Create' }}</button>
          <button class="btn btn-secondary" type="button" *ngIf="editingId" (click)="cancel()">Cancel</button>
        </div>
        <p class="error" *ngIf="error">{{ error }}</p>
      </form>
    </div>

    <div class="card">
      <table>
        <thead><tr><th>ID</th><th>Type</th><th>Hours</th><th>Course</th><th>Lecturer</th><th></th></tr></thead>
        <tbody>
          <tr *ngFor="let s of sections">
            <td>{{ s.id }}</td>
            <td>{{ s.type }}</td>
            <td>{{ s.hours }}</td>
            <td>{{ s.activeCourse?.course?.code }} ({{ s.activeCourse?.academicYear }})</td>
            <td>{{ s.lecturer?.firstName }} {{ s.lecturer?.lastName }}</td>
            <td>
              <button class="btn btn-secondary" (click)="edit(s)">Edit</button>
              <button class="btn btn-danger" (click)="remove(s.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class SectionsComponent implements OnInit {
  sections: Section[] = [];
  activeCourses: ActiveCourse[] = [];
  lecturers: User[] = [];
  types = ['THEORY', 'LAB', 'SEMINAR'];
  form = { type: 'THEORY', hours: 1, activeCourseId: 0, lecturerId: 0 };
  editingId: number | null = null;
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.load();
    this.api.getActiveCourses().subscribe(data => this.activeCourses = data);
    // seuls les users de categorie LECTURER sont proposables comme enseignants
    this.api.getUsers().subscribe(data => this.lecturers = data.filter(u => u.category?.name === 'LECTURER'));
  }

  load() { this.api.getSections().subscribe(data => this.sections = data); }

  save() {
    this.error = '';
    const req = this.editingId
      ? this.api.updateSection(this.editingId, this.form)
      : this.api.createSection(this.form);
    req.subscribe({
      next: () => { this.cancel(); this.load(); },
      error: err => this.error = err.error?.message ?? 'Error'
    });
  }

  edit(s: Section) {
    this.editingId = s.id;
    this.form = { type: s.type, hours: s.hours, activeCourseId: s.activeCourse?.id ?? 0, lecturerId: s.lecturer?.id ?? 0 };
  }

  cancel() {
    this.editingId = null;
    this.form = { type: 'THEORY', hours: 1, activeCourseId: 0, lecturerId: 0 };
  }

  remove(id: number) {
    if (!confirm('Delete this section?')) return;
    this.api.deleteSection(id).subscribe({ next: () => this.load(), error: err => this.error = err.error?.message ?? 'Error' });
  }
}
