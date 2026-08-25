import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Department, Faculty } from '../../models/models';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';
import { IconComponent } from '../../components/icon/icon.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { SearchBoxComponent } from '../../components/search-box/search-box.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, SpinnerComponent, SearchBoxComponent, PaginationComponent],
  template: `
    <div class="page-header"><h2>Departments</h2></div>

    <div class="card">
      <form (ngSubmit)="save()">
        <div><label>Name</label><input [(ngModel)]="form.name" name="name" required></div>
        <div>
          <label>Faculty</label>
          <select [(ngModel)]="form.facultyId" name="facultyId" required>
            <option [ngValue]="0" disabled>-- select faculty --</option>
            <option *ngFor="let f of faculties" [ngValue]="f.id">{{ f.name }}</option>
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
        <app-search-box placeholder="Search departments..." [value]="search" (valueChange)="onSearch($event)"></app-search-box>
      </div>

      <div class="spinner-wrap" *ngIf="loading"><app-spinner></app-spinner></div>

      <ng-container *ngIf="!loading">
        <table *ngIf="filtered.length; else empty">
          <thead><tr><th>ID</th><th>Name</th><th>Faculty</th><th></th></tr></thead>
          <tbody>
            <tr *ngFor="let d of paged">
              <td>{{ d.id }}</td>
              <td>{{ d.name }}</td>
              <td>{{ d.faculty?.name }}</td>
              <td>
                <button class="btn btn-secondary" (click)="edit(d)"><app-icon name="edit" [size]="13"></app-icon> Edit</button>
                <button class="btn btn-danger" (click)="remove(d)"><app-icon name="trash" [size]="13"></app-icon> Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
        <ng-template #empty><p class="empty-state">No departments match your search.</p></ng-template>
        <app-pagination [page]="page" [pageSize]="pageSize" [length]="filtered.length" (pageChange)="page = $event"></app-pagination>
      </ng-container>
    </div>
  `
})
export class DepartmentsComponent implements OnInit {
  departments: Department[] = [];
  faculties: Faculty[] = [];
  form = { name: '', facultyId: 0 };
  editingId: number | null = null;
  error = '';
  loading = true;
  search = '';
  page = 1;
  pageSize = 8;

  constructor(private api: ApiService, private toast: ToastService, private confirm: ConfirmService) {}

  ngOnInit() {
    this.load();
    this.api.getFaculties().subscribe(data => this.faculties = data);
  }

  load() {
    this.loading = true;
    this.api.getDepartments().subscribe({
      next: data => { this.departments = data; this.loading = false; },
      error: () => { this.loading = false; this.toast.error('Failed to load departments'); }
    });
  }

  get filtered(): Department[] {
    const term = this.search.trim().toLowerCase();
    if (!term) return this.departments;
    return this.departments.filter(d => d.name.toLowerCase().includes(term) || (d.faculty?.name.toLowerCase().includes(term) ?? false));
  }

  get paged(): Department[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  onSearch(v: string) { this.search = v; this.page = 1; }

  save() {
    this.error = '';
    const wasEdit = !!this.editingId;
    const req = this.editingId
      ? this.api.updateDepartment(this.editingId, this.form)
      : this.api.createDepartment(this.form);
    req.subscribe({
      next: () => { this.cancel(); this.load(); this.toast.success(wasEdit ? 'Department updated' : 'Department created'); },
      error: err => { this.error = err.error?.message ?? 'Error'; this.toast.error(this.error); }
    });
  }

  edit(d: Department) { this.editingId = d.id; this.form = { name: d.name, facultyId: d.faculty?.id ?? 0 }; }
  cancel() { this.editingId = null; this.form = { name: '', facultyId: 0 }; }

  async remove(d: Department) {
    const ok = await this.confirm.ask(`Delete department "${d.name}"?`, { danger: true, confirmLabel: 'Delete' });
    if (!ok) return;
    this.api.deleteDepartment(d.id).subscribe({
      next: () => { this.load(); this.toast.success('Department deleted'); },
      error: err => this.toast.error(err.error?.message ?? 'Error deleting department')
    });
  }
}
