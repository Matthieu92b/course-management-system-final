import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ActiveCourse, Course, StudyProgram } from '../../models/models';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';
import { IconComponent } from '../../components/icon/icon.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { SearchBoxComponent } from '../../components/search-box/search-box.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';

@Component({
  selector: 'app-active-courses',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, SpinnerComponent, SearchBoxComponent, PaginationComponent],
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
          <button class="btn btn-primary" type="submit">
            <app-icon [name]="editingId ? 'check' : 'plus'" [size]="14"></app-icon>
            {{ editingId ? 'Update' : 'Create' }}
          </button>
          <button class="btn btn-secondary" type="button" *ngIf="editingId" (click)="cancel()">Cancel</button>
        </div>
        <p class="error" *ngIf="error">{{ error }}</p>
      </form>
    </div>

    <div class="card">
      <div class="filters-row">
        <div class="filter-field">
          <label>Academic year</label>
          <select [(ngModel)]="filterYear" name="filterYear" (ngModelChange)="page = 1">
            <option [ngValue]="null">All years</option>
            <option *ngFor="let y of availableYears" [ngValue]="y">{{ y }}</option>
          </select>
        </div>
        <div class="filter-field">
          <label>Semester</label>
          <select [(ngModel)]="filterSemester" name="filterSemester" (ngModelChange)="page = 1">
            <option [ngValue]="null">All semesters</option>
            <option [ngValue]="1">Semester 1</option>
            <option [ngValue]="2">Semester 2</option>
          </select>
        </div>
      </div>

      <div class="table-toolbar">
        <app-search-box placeholder="Search program or course..." [value]="search" (valueChange)="onSearch($event)"></app-search-box>
      </div>

      <div class="spinner-wrap" *ngIf="loading"><app-spinner></app-spinner></div>

      <ng-container *ngIf="!loading">
        <table *ngIf="filtered.length; else empty">
          <thead><tr><th>ID</th><th>Program</th><th>Course</th><th>Year</th><th>Semester</th><th>Typology</th><th></th></tr></thead>
          <tbody>
            <tr *ngFor="let ac of paged">
              <td>{{ ac.id }}</td>
              <td>{{ ac.studyProgram?.name }}</td>
              <td>{{ ac.course?.code }} - {{ ac.course?.title }}</td>
              <td>{{ ac.academicYear }}</td>
              <td>{{ ac.semester }}</td>
              <td>{{ ac.typology }}</td>
              <td>
                <button class="btn btn-secondary" (click)="edit(ac)"><app-icon name="edit" [size]="13"></app-icon> Edit</button>
                <button class="btn btn-danger" (click)="remove(ac)"><app-icon name="trash" [size]="13"></app-icon> Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
        <ng-template #empty><p class="empty-state">No active course assignments match your filters.</p></ng-template>
        <app-pagination [page]="page" [pageSize]="pageSize" [length]="filtered.length" (pageChange)="page = $event"></app-pagination>
      </ng-container>
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
  loading = true;
  search = '';
  filterYear: number | null = null;
  filterSemester: number | null = null;
  page = 1;
  pageSize = 10;

  constructor(private api: ApiService, private toast: ToastService, private confirm: ConfirmService) {}

  ngOnInit() {
    this.load();
    this.api.getStudyPrograms().subscribe(data => this.programs = data);
    this.api.getCourses().subscribe(data => this.courses = data);
  }

  load() {
    this.loading = true;
    this.api.getActiveCourses().subscribe({
      next: data => { this.activeCourses = data; this.loading = false; },
      error: () => { this.loading = false; this.toast.error('Failed to load active courses'); }
    });
  }

  get availableYears(): number[] {
    return [...new Set(this.activeCourses.map(ac => ac.academicYear))].sort((a, b) => b - a);
  }

  get filtered(): ActiveCourse[] {
    const term = this.search.trim().toLowerCase();
    return this.activeCourses.filter(ac => {
      if (this.filterYear != null && ac.academicYear !== this.filterYear) return false;
      if (this.filterSemester != null && ac.semester !== this.filterSemester) return false;
      if (!term) return true;
      return (ac.studyProgram?.name.toLowerCase().includes(term) ?? false) ||
             (ac.course?.code.toLowerCase().includes(term) ?? false) ||
             (ac.course?.title.toLowerCase().includes(term) ?? false);
    });
  }

  get paged(): ActiveCourse[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  onSearch(v: string) { this.search = v; this.page = 1; }

  save() {
    this.error = '';
    const wasEdit = !!this.editingId;
    const req = this.editingId
      ? this.api.updateActiveCourse(this.editingId, this.form)
      : this.api.createActiveCourse(this.form);
    req.subscribe({
      next: () => { this.cancel(); this.load(); this.toast.success(wasEdit ? 'Assignment updated' : 'Assignment created'); },
      error: err => { this.error = err.error?.message ?? 'Error'; this.toast.error(this.error); }
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

  async remove(ac: ActiveCourse) {
    const ok = await this.confirm.ask('Delete this assignment? Sections referencing it will block the delete.', { danger: true, confirmLabel: 'Delete' });
    if (!ok) return;
    this.api.deleteActiveCourse(ac.id).subscribe({
      next: () => { this.load(); this.toast.success('Assignment deleted'); },
      error: err => this.toast.error(err.error?.message ?? 'Error deleting assignment')
    });
  }
}
