import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Category } from '../../models/models';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';
import { IconComponent } from '../../components/icon/icon.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { SearchBoxComponent } from '../../components/search-box/search-box.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, SpinnerComponent, SearchBoxComponent],
  template: `
    <div class="page-header"><h2>Categories</h2></div>

    <div class="card">
      <form (ngSubmit)="save()">
        <div>
          <label>Name</label>
          <input [(ngModel)]="name" name="name" required placeholder="SECRETARY">
        </div>
        <div><button class="btn btn-primary" type="submit"><app-icon name="plus" [size]="14"></app-icon> Create</button></div>
        <p class="error" *ngIf="error">{{ error }}</p>
      </form>
    </div>

    <div class="card">
      <div class="table-toolbar">
        <app-search-box placeholder="Search categories..." [value]="search" (valueChange)="search = $event"></app-search-box>
      </div>

      <div class="spinner-wrap" *ngIf="loading"><app-spinner></app-spinner></div>

      <ng-container *ngIf="!loading">
        <table *ngIf="filtered.length; else empty">
          <thead><tr><th>ID</th><th>Name</th><th></th></tr></thead>
          <tbody>
            <tr *ngFor="let c of filtered">
              <td>{{ c.id }}</td>
              <td>{{ c.name }}</td>
              <td><button class="btn btn-danger" (click)="remove(c)"><app-icon name="trash" [size]="13"></app-icon> Delete</button></td>
            </tr>
          </tbody>
        </table>
        <ng-template #empty><p class="empty-state">No categories match your search.</p></ng-template>
      </ng-container>
    </div>
  `
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  name = '';
  error = '';
  loading = true;
  search = '';

  constructor(private api: ApiService, private toast: ToastService, private confirm: ConfirmService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.api.getCategories().subscribe({
      next: data => { this.categories = data; this.loading = false; },
      error: () => { this.loading = false; this.toast.error('Failed to load categories'); }
    });
  }

  get filtered(): Category[] {
    const term = this.search.trim().toLowerCase();
    if (!term) return this.categories;
    return this.categories.filter(c => c.name.toLowerCase().includes(term));
  }

  save() {
    this.error = '';
    this.api.createCategory({ name: this.name }).subscribe({
      next: () => { this.name = ''; this.load(); this.toast.success('Category created'); },
      error: err => { this.error = err.error?.message ?? 'Error'; this.toast.error(this.error); }
    });
  }

  async remove(c: Category) {
    const ok = await this.confirm.ask(`Delete category "${c.name}"? Users referencing it will block the delete.`, { danger: true, confirmLabel: 'Delete' });
    if (!ok) return;
    this.api.deleteCategory(c.id).subscribe({
      next: () => { this.load(); this.toast.success('Category deleted'); },
      error: err => this.toast.error(err.error?.message ?? 'Cannot delete: category in use')
    });
  }
}
