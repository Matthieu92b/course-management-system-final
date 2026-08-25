import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Faculty } from '../../models/models';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';
import { IconComponent } from '../../components/icon/icon.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { SearchBoxComponent } from '../../components/search-box/search-box.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';

@Component({
  selector: 'app-faculties',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, SpinnerComponent, SearchBoxComponent, PaginationComponent],
  template: `
    <div class="page-header">
      <h2>Faculties</h2>
    </div>

    <div class="card">
      <form (ngSubmit)="save()">
        <div>
          <label>Name</label>
          <input [(ngModel)]="name" name="name" required placeholder="Faculty of Science">
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
        <app-search-box placeholder="Search faculties..." [value]="search" (valueChange)="onSearch($event)"></app-search-box>
      </div>

      <div class="spinner-wrap" *ngIf="loading"><app-spinner></app-spinner></div>

      <ng-container *ngIf="!loading">
        <table *ngIf="filtered.length; else empty">
          <thead><tr><th>ID</th><th>Name</th><th></th></tr></thead>
          <tbody>
            <tr *ngFor="let f of paged">
              <td>{{ f.id }}</td>
              <td>{{ f.name }}</td>
              <td>
                <button class="btn btn-secondary" (click)="edit(f)"><app-icon name="edit" [size]="13"></app-icon> Edit</button>
                <button class="btn btn-danger" (click)="remove(f)"><app-icon name="trash" [size]="13"></app-icon> Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
        <ng-template #empty><p class="empty-state">No faculties match your search.</p></ng-template>
        <app-pagination [page]="page" [pageSize]="pageSize" [length]="filtered.length" (pageChange)="page = $event"></app-pagination>
      </ng-container>
    </div>
  `
})
export class FacultiesComponent implements OnInit {
  faculties: Faculty[] = [];
  name = '';
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
    this.api.getFaculties().subscribe({
      next: data => { this.faculties = data; this.loading = false; },
      error: () => { this.loading = false; this.toast.error('Failed to load faculties'); }
    });
  }

  get filtered(): Faculty[] {
    const term = this.search.trim().toLowerCase();
    if (!term) return this.faculties;
    return this.faculties.filter(f => f.name.toLowerCase().includes(term));
  }

  get paged(): Faculty[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  onSearch(v: string) { this.search = v; this.page = 1; }

  save() {
    this.error = '';
    const req = this.editingId
      ? this.api.updateFaculty(this.editingId, { name: this.name })
      : this.api.createFaculty({ name: this.name });
    const wasEdit = !!this.editingId;
    req.subscribe({
      next: () => { this.cancel(); this.load(); this.toast.success(wasEdit ? 'Faculty updated' : 'Faculty created'); },
      error: err => { this.error = err.error?.message ?? 'Error'; this.toast.error(this.error); }
    });
  }

  edit(f: Faculty) { this.editingId = f.id; this.name = f.name; }
  cancel() { this.editingId = null; this.name = ''; }

  async remove(f: Faculty) {
    const ok = await this.confirm.ask(`Delete faculty "${f.name}"? This cannot be undone.`, { danger: true, confirmLabel: 'Delete' });
    if (!ok) return;
    this.api.deleteFaculty(f.id).subscribe({
      next: () => { this.load(); this.toast.success('Faculty deleted'); },
      error: err => this.toast.error(err.error?.message ?? 'Error deleting faculty')
    });
  }
}
