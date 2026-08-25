import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ActiveCourse, Cohort, CohortSummary, Section, User } from '../../models/models';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';
import { IconComponent } from '../../components/icon/icon.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { SearchBoxComponent } from '../../components/search-box/search-box.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';

@Component({
  selector: 'app-sections',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, SpinnerComponent, SearchBoxComponent, PaginationComponent],
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
        <div><label>Capacity</label><input type="number" [(ngModel)]="form.capacity" name="capacity" required min="1" placeholder="30"></div>
        <div><label>Room</label><input [(ngModel)]="form.room" name="room" required placeholder="A101"></div>
        <div>
          <label>Day of week</label>
          <select [(ngModel)]="form.dayOfWeek" name="dayOfWeek" required>
            <option *ngFor="let d of days" [ngValue]="d">{{ d }}</option>
          </select>
        </div>
        <div><label>Start time</label><input type="time" [(ngModel)]="form.startTime" name="startTime" required></div>
        <div><label>End time</label><input type="time" [(ngModel)]="form.endTime" name="endTime" required></div>
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
        <app-search-box placeholder="Search sections..." [value]="search" (valueChange)="onSearch($event)"></app-search-box>
      </div>

      <div class="spinner-wrap" *ngIf="loading"><app-spinner></app-spinner></div>

      <ng-container *ngIf="!loading">
        <table *ngIf="filtered.length; else empty">
          <thead><tr><th>ID</th><th>Type</th><th>Hours</th><th>Course</th><th>Room</th><th>Schedule</th><th>Lecturer</th><th></th></tr></thead>
          <tbody>
            <tr *ngFor="let s of paged">
              <td>{{ s.id }}</td>
              <td>{{ s.type }}</td>
              <td>{{ s.hours }}</td>
              <td>{{ s.activeCourse?.course?.code }} ({{ s.activeCourse?.academicYear }})</td>
              <td>{{ s.room || '—' }}</td>
              <td>{{ s.dayOfWeek ? (s.dayOfWeek + ' ' + s.startTime + '-' + s.endTime) : '—' }}</td>
              <td>{{ s.lecturer?.firstName }} {{ s.lecturer?.lastName }}</td>
              <td>
                <button class="btn btn-secondary" (click)="showCohorts(s)"><app-icon name="cohort" [size]="13"></app-icon> Cohorts</button>
                <button class="btn btn-secondary" (click)="edit(s)"><app-icon name="edit" [size]="13"></app-icon> Edit</button>
                <button class="btn btn-danger" (click)="remove(s)"><app-icon name="trash" [size]="13"></app-icon> Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
        <ng-template #empty><p class="empty-state">No sections match your search.</p></ng-template>
        <app-pagination [page]="page" [pageSize]="pageSize" [length]="filtered.length" (pageChange)="page = $event"></app-pagination>
      </ng-container>
    </div>

    <div class="card" *ngIf="selectedSection">
      <h3>Cohorts following section #{{ selectedSection.id }} ({{ selectedSection.activeCourse?.course?.code }})</h3>

      <table *ngIf="selectedSectionCohorts.length; else noCohorts">
        <thead><tr><th>Cohort</th><th></th></tr></thead>
        <tbody>
          <tr *ngFor="let c of selectedSectionCohorts">
            <td>{{ c.name }}</td>
            <td><button class="btn btn-danger" (click)="unassignCohort(c)"><app-icon name="trash" [size]="13"></app-icon> Remove</button></td>
          </tr>
        </tbody>
      </table>
      <ng-template #noCohorts><p class="empty-state">No cohort assigned to this section yet.</p></ng-template>

      <form (ngSubmit)="assignCohort()" style="margin-top: 14px;">
        <div>
          <label>Add cohort</label>
          <select [(ngModel)]="cohortToAdd" name="cohortToAdd" required>
            <option [ngValue]="0" disabled>-- select cohort --</option>
            <option *ngFor="let c of availableCohorts" [ngValue]="c.id">{{ c.name }} ({{ c.academicYear }})</option>
          </select>
        </div>
        <div><button class="btn btn-primary" type="submit"><app-icon name="plus" [size]="14"></app-icon> Add</button></div>
      </form>
    </div>
  `
})
export class SectionsComponent implements OnInit {
  sections: Section[] = [];
  activeCourses: ActiveCourse[] = [];
  lecturers: User[] = [];
  allCohorts: Cohort[] = [];
  types = ['THEORY', 'LAB', 'SEMINAR'];
  days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  form = {
    type: 'THEORY', hours: 1, activeCourseId: 0, lecturerId: 0,
    capacity: 30, room: '', dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '11:00'
  };
  editingId: number | null = null;
  error = '';
  loading = true;
  search = '';
  page = 1;
  pageSize = 10;

  selectedSection: Section | null = null;
  selectedSectionCohorts: CohortSummary[] = [];
  cohortToAdd = 0;

  constructor(private api: ApiService, private toast: ToastService, private confirm: ConfirmService) {}

  ngOnInit() {
    this.load();
    this.api.getActiveCourses().subscribe(data => this.activeCourses = data);
    // seuls les users de categorie LECTURER sont proposables comme enseignants
    this.api.getUsers().subscribe(data => this.lecturers = data.filter(u => u.category?.name === 'LECTURER'));
    this.api.getCohorts().subscribe(data => this.allCohorts = data);
  }

  get availableCohorts(): Cohort[] {
    const assignedIds = new Set(this.selectedSectionCohorts.map(c => c.id));
    return this.allCohorts.filter(c => !assignedIds.has(c.id));
  }

  showCohorts(s: Section) {
    this.selectedSection = s;
    this.loadSectionCohorts(s.id);
  }

  loadSectionCohorts(sectionId: number) {
    this.api.getCohortsForSection(sectionId).subscribe({
      next: data => this.selectedSectionCohorts = data,
      error: () => this.toast.error('Failed to load cohorts for this section')
    });
  }

  assignCohort() {
    if (!this.selectedSection || !this.cohortToAdd) return;
    this.api.assignCohortToSection(this.selectedSection.id, this.cohortToAdd).subscribe({
      next: () => {
        this.cohortToAdd = 0;
        this.loadSectionCohorts(this.selectedSection!.id);
        this.toast.success('Cohort assigned to section');
      },
      error: err => this.toast.error(err.error?.message ?? 'Failed to assign cohort')
    });
  }

  async unassignCohort(cohort: CohortSummary) {
    if (!this.selectedSection) return;
    const ok = await this.confirm.ask(`Remove cohort "${cohort.name}" from this section?`, { danger: true, confirmLabel: 'Remove' });
    if (!ok) return;
    this.api.unassignCohortFromSection(this.selectedSection.id, cohort.id).subscribe({
      next: () => {
        this.loadSectionCohorts(this.selectedSection!.id);
        this.toast.success('Cohort removed from section');
      },
      error: err => this.toast.error(err.error?.message ?? 'Failed to remove cohort')
    });
  }

  load() {
    this.loading = true;
    this.api.getSections().subscribe({
      next: data => { this.sections = data; this.loading = false; },
      error: () => { this.loading = false; this.toast.error('Failed to load sections'); }
    });
  }

  get filtered(): Section[] {
    const term = this.search.trim().toLowerCase();
    if (!term) return this.sections;
    return this.sections.filter(s =>
      s.type.toLowerCase().includes(term) ||
      (s.room?.toLowerCase().includes(term) ?? false) ||
      (s.activeCourse?.course?.code.toLowerCase().includes(term) ?? false) ||
      (s.lecturer?.firstName.toLowerCase().includes(term) ?? false) ||
      (s.lecturer?.lastName.toLowerCase().includes(term) ?? false)
    );
  }

  get paged(): Section[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  onSearch(v: string) { this.search = v; this.page = 1; }

  save() {
    this.error = '';
    const wasEdit = !!this.editingId;
    const req = this.editingId
      ? this.api.updateSection(this.editingId, this.form)
      : this.api.createSection(this.form);
    req.subscribe({
      next: () => { this.cancel(); this.load(); this.toast.success(wasEdit ? 'Section updated' : 'Section created'); },
      error: err => { this.error = err.error?.message ?? 'Error'; this.toast.error(this.error); }
    });
  }

  edit(s: Section) {
    this.editingId = s.id;
    this.form = {
      type: s.type,
      hours: s.hours,
      activeCourseId: s.activeCourse?.id ?? 0,
      lecturerId: s.lecturer?.id ?? 0,
      capacity: s.capacity ?? 30,
      room: s.room ?? '',
      dayOfWeek: s.dayOfWeek ?? 'MONDAY',
      startTime: (s.startTime ?? '09:00').slice(0, 5),
      endTime: (s.endTime ?? '11:00').slice(0, 5)
    };
  }

  cancel() {
    this.editingId = null;
    this.form = {
      type: 'THEORY', hours: 1, activeCourseId: 0, lecturerId: 0,
      capacity: 30, room: '', dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '11:00'
    };
  }

  async remove(s: Section) {
    const ok = await this.confirm.ask(`Delete section #${s.id}?`, { danger: true, confirmLabel: 'Delete' });
    if (!ok) return;
    this.api.deleteSection(s.id).subscribe({
      next: () => { this.load(); this.toast.success('Section deleted'); },
      error: err => this.toast.error(err.error?.message ?? 'Error deleting section')
    });
  }
}
