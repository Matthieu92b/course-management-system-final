import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Department, StudyProgram } from '../../models/models';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';
import { IconComponent } from '../../components/icon/icon.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { SearchBoxComponent } from '../../components/search-box/search-box.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';

@Component({
  selector: 'app-study-programs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IconComponent, SpinnerComponent, SearchBoxComponent, PaginationComponent],
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
        <app-search-box placeholder="Search programs..." [value]="search" (valueChange)="onSearch($event)"></app-search-box>
      </div>

      <div class="spinner-wrap" *ngIf="loading"><app-spinner></app-spinner></div>

      <ng-container *ngIf="!loading">
        <table *ngIf="filtered.length; else empty">
          <thead><tr><th>ID</th><th>Name</th><th>Level</th><th>Department</th><th></th></tr></thead>
          <tbody>
            <tr *ngFor="let p of paged">
              <td>{{ p.id }}</td>
              <td><a [routerLink]="['/study-programs', p.id]">{{ p.name }}</a></td>
              <td>{{ p.level }}</td>
              <td>{{ p.department?.name }}</td>
              <td>
                <a class="btn btn-secondary" [routerLink]="['/study-programs', p.id]"><app-icon name="eye" [size]="13"></app-icon> Details</a>
                <button class="btn btn-secondary" (click)="edit(p)"><app-icon name="edit" [size]="13"></app-icon> Edit</button>
                <button class="btn btn-danger" (click)="remove(p)"><app-icon name="trash" [size]="13"></app-icon> Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
        <ng-template #empty><p class="empty-state">No study programs match your search.</p></ng-template>
        <app-pagination [page]="page" [pageSize]="pageSize" [length]="filtered.length" (pageChange)="page = $event"></app-pagination>
      </ng-container>
    </div>
  `
})
export class StudyProgramsComponent implements OnInit {
  programs: StudyProgram[] = [];
  departments: Department[] = [];
  form = { name: '', level: '', departmentId: 0 };
  editingId: number | null = null;
  error = '';
  loading = true;
  search = '';
  page = 1;
  pageSize = 8;

  constructor(private api: ApiService, private toast: ToastService, private confirm: ConfirmService) {}

  ngOnInit() {
    this.load();
    this.api.getDepartments().subscribe(data => this.departments = data);
  }

  load() {
    this.loading = true;
    this.api.getStudyPrograms().subscribe({
      next: data => { this.programs = data; this.loading = false; },
      error: () => { this.loading = false; this.toast.error('Failed to load study programs'); }
    });
  }

  get filtered(): StudyProgram[] {
    const term = this.search.trim().toLowerCase();
    if (!term) return this.programs;
    return this.programs.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.level.toLowerCase().includes(term) ||
      (p.department?.name.toLowerCase().includes(term) ?? false)
    );
  }

  get paged(): StudyProgram[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  onSearch(v: string) { this.search = v; this.page = 1; }

  save() {
    this.error = '';
    const wasEdit = !!this.editingId;
    const req = this.editingId
      ? this.api.updateStudyProgram(this.editingId, this.form)
      : this.api.createStudyProgram(this.form);
    req.subscribe({
      next: () => { this.cancel(); this.load(); this.toast.success(wasEdit ? 'Study program updated' : 'Study program created'); },
      error: err => { this.error = err.error?.message ?? 'Error'; this.toast.error(this.error); }
    });
  }

  edit(p: StudyProgram) { this.editingId = p.id; this.form = { name: p.name, level: p.level, departmentId: p.department?.id ?? 0 }; }
  cancel() { this.editingId = null; this.form = { name: '', level: '', departmentId: 0 }; }

  async remove(p: StudyProgram) {
    const ok = await this.confirm.ask(`Delete study program "${p.name}"?`, { danger: true, confirmLabel: 'Delete' });
    if (!ok) return;
    this.api.deleteStudyProgram(p.id).subscribe({
      next: () => { this.load(); this.toast.success('Study program deleted'); },
      error: err => this.toast.error(err.error?.message ?? 'Error deleting study program')
    });
  }
}
