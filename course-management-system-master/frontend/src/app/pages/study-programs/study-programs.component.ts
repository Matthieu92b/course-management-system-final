import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Department, StudyProgram } from '../../models/models';

@Component({
  selector: 'app-study-programs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header"><h2>Study Programs</h2></div>

    <div class="card">
      <form (ngSubmit)="save()">
        <div><label>Name</label><input [(ngModel)]="form.name" name="name" required></div>
        <div><label>Level</label><input [(ngModel)]="form.level" name="level" required placeholder="Bachelor / Master"></div>
        <div>
          <label>Department</label>
          <select [(ngModel)]="form.departmentId" name="departmentId" required>
            <option [ngValue]="0" disabled>-- select department --</option>
            <option *ngFor="let d of departments" [ngValue]="d.id">{{ d.name }}</option>
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
        <thead><tr><th>ID</th><th>Name</th><th>Level</th><th>Department</th><th></th></tr></thead>
        <tbody>
          <tr *ngFor="let p of programs">
            <td>{{ p.id }}</td>
            <td>{{ p.name }}</td>
            <td>{{ p.level }}</td>
            <td>{{ p.department?.name }}</td>
            <td>
              <button class="btn btn-secondary" (click)="showCourses(p)">Courses</button>
              <button class="btn btn-secondary" (click)="edit(p)">Edit</button>
              <button class="btn btn-danger" (click)="remove(p.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card" *ngIf="selectedProgram">
      <h3>Active courses of {{ selectedProgram.name }}</h3>
      <table *ngIf="programCourses.length; else noCourses">
        <thead><tr><th>Code</th><th>Title</th><th>Credits</th><th>Year</th><th>Semester</th><th>Typology</th></tr></thead>
        <tbody>
          <tr *ngFor="let c of programCourses">
            <td>{{ c.code }}</td>
            <td>{{ c.title }}</td>
            <td>{{ c.credits }}</td>
            <td>{{ c.academicYear }}</td>
            <td>{{ c.semester }}</td>
            <td>{{ c.typology }}</td>
          </tr>
        </tbody>
      </table>
      <ng-template #noCourses><p>No active courses for this program.</p></ng-template>
    </div>
  `
})
export class StudyProgramsComponent implements OnInit {
  programs: StudyProgram[] = [];
  departments: Department[] = [];
  programCourses: any[] = [];
  selectedProgram: StudyProgram | null = null;
  form = { name: '', level: '', departmentId: 0 };
  editingId: number | null = null;
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.load();
    this.api.getDepartments().subscribe(data => this.departments = data);
  }

  load() { this.api.getStudyPrograms().subscribe(data => this.programs = data); }

  save() {
    this.error = '';
    const req = this.editingId
      ? this.api.updateStudyProgram(this.editingId, this.form)
      : this.api.createStudyProgram(this.form);
    req.subscribe({
      next: () => { this.cancel(); this.load(); },
      error: err => this.error = err.error?.message ?? 'Error'
    });
  }

  edit(p: StudyProgram) { this.editingId = p.id; this.form = { name: p.name, level: p.level, departmentId: p.department?.id ?? 0 }; }
  cancel() { this.editingId = null; this.form = { name: '', level: '', departmentId: 0 }; }

  remove(id: number) {
    if (!confirm('Delete this program?')) return;
    this.api.deleteStudyProgram(id).subscribe({ next: () => this.load(), error: err => this.error = err.error?.message ?? 'Error' });
  }

  showCourses(p: StudyProgram) {
    this.selectedProgram = p;
    this.api.getCoursesForProgram(p.id).subscribe(data => this.programCourses = data);
  }
}
