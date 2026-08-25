import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Cohort, StudyProgram } from '../../models/models';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';
import { IconComponent } from '../../components/icon/icon.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { SearchBoxComponent } from '../../components/search-box/search-box.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';

@Component({
  selector: 'app-cohorts',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, SpinnerComponent, SearchBoxComponent, PaginationComponent],
  template: `
    <div class="page-header"><h2>Cohorts</h2></div>

    <div class="card">
      <form (ngSubmit)="save()">
        <div><label>Name</label><input [(ngModel)]="form.name" name="name" required placeholder="L1-INFO-A"></div>
        <div>
          <label>Study Program</label>
          <select [(ngModel)]="form.studyProgramId" name="studyProgramId" required>
            <option [ngValue]="0" disabled>-- select program --</option>
            <option *ngFor="let p of programs" [ngValue]="p.id">{{ p.name }} ({{ p.level }})</option>
          </select>
        </div>
        <div><label>Academic Year</label><input type="number" [(ngModel)]="form.academicYear" name="academicYear" required min="2000" max="2100"></div>
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
        <app-search-box placeholder="Search cohorts..." [value]="search" (valueChange)="onSearch($event)"></app-search-box>
      </div>

      <div class="spinner-wrap" *ngIf="loading"><app-spinner></app-spinner></div>

      <ng-container *ngIf="!loading">
        <table *ngIf="filtered.length; else empty">
          <thead><tr><th>ID</th><th>Name</th><th>Study Program</th><th>Year</th><th></th></tr></thead>
          <tbody>
            <tr *ngFor="let c of paged">
              <td>{{ c.id }}</td>
              <td>{{ c.name }}</td>
              <td>{{ c.studyProgram?.name }}</td>
              <td>{{ c.academicYear }}</td>
              <td>
                <button class="btn btn-secondary" (click)="edit(c)"><app-icon name="edit" [size]="13"></app-icon> Edit</button>
                <button class="btn btn-danger" (click)="remove(c)"><app-icon name="trash" [size]="13"></app-icon> Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
        <ng-template #empty><p class="empty-state">No cohorts match your search.</p></ng-template>
        <app-pagination [page]="page" [pageSize]="pageSize" [length]="filtered.length" (pageChange)="page = $event"></app-pagination>
      </ng-container>
    </div>
  `
})
export class CohortsComponent implements OnInit {
  cohorts: Cohort[] = [];
  programs: StudyProgram[] = [];
  form = { name: '', studyProgramId: 0, academicYear: new Date().getFullYear() };
  editingId: number | null = null;
  error = '';
  loading = true;
  search = '';
  page = 1;
  pageSize = 8;

  constructor(private api: ApiService, private toast: ToastService, private confirm: ConfirmService) {}

  ngOnInit() {
    this.load();
    this.api.getStudyPrograms().subscribe(data => this.programs = data);
  }

  load() {
    this.loading = true;
    this.api.getCohorts().subscribe({
      next: data => { this.cohorts = data; this.loading = false; },
      error: () => { this.loading = false; this.toast.error('Failed to load cohorts'); }
    });
  }

  get filtered(): Cohort[] {
    const term = this.search.trim().toLowerCase();
    if (!term) return this.cohorts;
    return this.cohorts.filter(c =>
      c.name.toLowerCase().includes(term) || (c.studyProgram?.name.toLowerCase().includes(term) ?? false)
    );
  }

  get paged(): Cohort[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  onSearch(v: string) { this.search = v; this.page = 1; }

  save() {
    this.error = '';
    const wasEdit = !!this.editingId;
    const req = this.editingId
      ? this.api.updateCohort(this.editingId, this.form)
      : this.api.createCohort(this.form);
    req.subscribe({
      next: () => { this.cancel(); this.load(); this.toast.success(wasEdit ? 'Cohort updated' : 'Cohort created'); },
      error: err => { this.error = err.error?.message ?? 'Error'; this.toast.error(this.error); }
    });
  }

  edit(c: Cohort) { this.editingId = c.id; this.form = { name: c.name, studyProgramId: c.studyProgram?.id ?? 0, academicYear: c.academicYear }; }
  cancel() { this.editingId = null; this.form = { name: '', studyProgramId: 0, academicYear: new Date().getFullYear() }; }

  async remove(c: Cohort) {
    const ok = await this.confirm.ask(`Delete cohort "${c.name}"? Students referencing it will block the delete.`, { danger: true, confirmLabel: 'Delete' });
    if (!ok) return;
    this.api.deleteCohort(c.id).subscribe({
      next: () => { this.load(); this.toast.success('Cohort deleted'); },
      error: err => this.toast.error(err.error?.message ?? 'Error deleting cohort')
    });
  }
}
