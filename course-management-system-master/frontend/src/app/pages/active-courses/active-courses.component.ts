import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ActiveCourse, Course, StudyProgram } from '../../models/models';

@Component({
  selector: 'app-active-courses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header"><h2>Active Courses (Program ↔ Course assignments)</h2></div>

    <div class="card">
      <form (ngSubmit)="save()">
        <div>
          <label>Study Program</label>
          <select [(ngModel)]="form.studyProgramId" name="studyProgramId" required>
            <option [ngValue]="0" disabled>-- select program --</option>
            <option *ngFor="let p of programs" [ngValue]="p.id">{{ p.name }} ({{ p.level }})</option>
          </select>
        </div>
        <div>
          <label>Course</label>
          <select [(ngModel)]="form.courseId" name="courseId" required>
            <option [ngValue]="0" disabled>-- select course --</option>
            <option *ngFor="let c of courses" [ngValue]="c.id">{{ c.code }} - {{ c.title }}</option>
          </select>
        </div>
        <div><label>Academic Year</label><input type="number" [(ngModel)]="form.academicYear" name="academicYear" required min="2000" max="2100"></div>
        <div><label>Semester</label><input type="number" [(ngModel)]="form.semester" name="semester" required min="1" max="2"></div>
        <div>
          <label>Typology</label>
          <select [(ngModel)]="form.typology" name="typology" required>
            <option *ngFor="let t of typologies" [ngValue]="t">{{ t }}</option>
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
        <thead><tr><th>ID</th><th>Program</th><th>Course</th><th>Year</th><th>Semester</th><th>Typology</th><th></th></tr></thead>
        <tbody>
          <tr *ngFor="let ac of activeCourses">
            <td>{{ ac.id }}</td>
            <td>{{ ac.studyProgram?.name }}</td>
            <td>{{ ac.course?.code }} - {{ ac.course?.title }}</td>
            <td>{{ ac.academicYear }}</td>
            <td>{{ ac.semester }}</td>
            <td>{{ ac.typology }}</td>
            <td>
              <button class="btn btn-secondary" (click)="edit(ac)">Edit</button>
              <button class="btn btn-danger" (click)="remove(ac.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class ActiveCoursesComponent implements OnInit {
  activeCourses: ActiveCourse[] = [];
  programs: StudyProgram[] = [];
  courses: Course[] = [];
  typologies = ['A', 'B', 'C', 'D', 'E'];
  form = { studyProgramId: 0, courseId: 0, academicYear: new Date().getFullYear(), semester: 1, typology: 'A' };
  editingId: number | null = null;
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.load();
    this.api.getStudyPrograms().subscribe(data => this.programs = data);
    this.api.getCourses().subscribe(data => this.courses = data);
  }

  load() { this.api.getActiveCourses().subscribe(data => this.activeCourses = data); }

  save() {
    this.error = '';
    const req = this.editingId
      ? this.api.updateActiveCourse(this.editingId, this.form)
      : this.api.createActiveCourse(this.form);
    req.subscribe({
      next: () => { this.cancel(); this.load(); },
      error: err => this.error = err.error?.message ?? 'Error'
    });
  }

  edit(ac: ActiveCourse) {
    this.editingId = ac.id;
    this.form = {
      studyProgramId: ac.studyProgram?.id ?? 0,
      courseId: ac.course?.id ?? 0,
      academicYear: ac.academicYear,
      semester: ac.semester,
      typology: ac.typology
    };
  }

  cancel() {
    this.editingId = null;
    this.form = { studyProgramId: 0, courseId: 0, academicYear: new Date().getFullYear(), semester: 1, typology: 'A' };
  }

  remove(id: number) {
    if (!confirm('Delete this assignment? Sections referencing it will block the delete.')) return;
    this.api.deleteActiveCourse(id).subscribe({ next: () => this.load(), error: err => this.error = err.error?.message ?? 'Error' });
  }
}
