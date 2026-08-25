import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Course, Section } from '../../models/models';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';
import { IconComponent } from '../../components/icon/icon.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { SearchBoxComponent } from '../../components/search-box/search-box.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, SpinnerComponent, SearchBoxComponent, PaginationComponent],
  template: `
    <div class="page-header"><h2>Courses</h2></div>

    <div class="card">
      <form (ngSubmit)="save()">
        <div><label>Code</label><input [(ngModel)]="form.code" name="code" required placeholder="CS101"></div>
        <div><label>Title</label><input [(ngModel)]="form.title" name="title" required placeholder="Intro to Programming"></div>
        <div><label>Credits</label><input type="number" [(ngModel)]="form.credits" name="credits" required min="1"></div>
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
      <div class="table-toolbar">
        <app-search-box placeholder="Search courses..." [value]="search" (valueChange)="onSearch($event)"></app-search-box>
      </div>

      <div class="spinner-wrap" *ngIf="loading"><app-spinner></app-spinner></div>

      <ng-container *ngIf="!loading">
        <table *ngIf="filtered.length; else empty">
          <thead><tr><th>ID</th><th>Code</th><th>Title</th><th>Credits</th><th></th></tr></thead>
          <tbody>
            <tr *ngFor="let c of paged">
              <td>{{ c.id }}</td>
              <td>{{ c.code }}</td>
              <td>{{ c.title }}</td>
              <td>{{ c.credits }}</td>
              <td>
                <button class="btn btn-secondary" (click)="showSections(c)"><app-icon name="section" [size]="13"></app-icon> Sections</button>
                <button class="btn btn-secondary" (click)="edit(c)"><app-icon name="edit" [size]="13"></app-icon> Edit</button>
                <button class="btn btn-danger" (click)="remove(c)"><app-icon name="trash" [size]="13"></app-icon> Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
        <ng-template #empty><p class="empty-state">No courses match your search.</p></ng-template>
        <app-pagination [page]="page" [pageSize]="pageSize" [length]="filtered.length" (pageChange)="page = $event"></app-pagination>
      </ng-container>
    </div>

    <div class="card" *ngIf="selectedCourse">
      <h3>Sections of {{ selectedCourse.code }}</h3>
      <table *ngIf="sections.length; else noSections">
        <thead><tr><th>ID</th><th>Type</th><th>Hours</th><th>Room</th><th>Lecturer</th></tr></thead>
        <tbody>
          <tr *ngFor="let s of sections">
            <td>{{ s.id }}</td>
            <td>{{ s.type }}</td>
            <td>{{ s.hours }}</td>
            <td>{{ s.room || '—' }}</td>
            <td>{{ s.lecturer?.firstName }} {{ s.lecturer?.lastName }}</td>
          </tr>
        </tbody>
      </table>
      <ng-template #noSections><p class="empty-state">No sections for this course yet.</p></ng-template>
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
  loading = true;
  search = '';
  page = 1;
  pageSize = 8;

  constructor(private api: ApiService, private toast: ToastService, private confirm: ConfirmService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.api.getCourses().subscribe({
      next: data => { this.courses = data; this.loading = false; },
      error: () => { this.loading = false; this.toast.error('Failed to load courses'); }
    });
  }

  get filtered(): Course[] {
    const term = this.search.trim().toLowerCase();
    if (!term) return this.courses;
    return this.courses.filter(c => c.code.toLowerCase().includes(term) || c.title.toLowerCase().includes(term));
  }

  get paged(): Course[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  onSearch(v: string) { this.search = v; this.page = 1; }

  save() {
    this.error = '';
    const wasEdit = !!this.editingId;
    const req = this.editingId
      ? this.api.updateCourse(this.editingId, this.form)
      : this.api.createCourse(this.form);
    req.subscribe({
      next: () => { this.cancel(); this.load(); this.toast.success(wasEdit ? 'Course updated' : 'Course created'); },
      error: err => { this.error = err.error?.message ?? 'Error'; this.toast.error(this.error); }
    });
  }

  edit(c: Course) { this.editingId = c.id; this.form = { code: c.code, title: c.title, credits: c.credits }; }
  cancel() { this.editingId = null; this.form = { code: '', title: '', credits: 1 }; }

  async remove(c: Course) {
    const ok = await this.confirm.ask(`Delete course "${c.code} — ${c.title}"?`, { danger: true, confirmLabel: 'Delete' });
    if (!ok) return;
    this.api.deleteCourse(c.id).subscribe({
      next: () => { this.load(); this.toast.success('Course deleted'); },
      error: err => this.toast.error(err.error?.message ?? 'Error deleting course')
    });
  }

  showSections(c: Course) {
    this.selectedCourse = c;
    this.api.getSectionsForCourse(c.id).subscribe(data => this.sections = data);
  }
}
