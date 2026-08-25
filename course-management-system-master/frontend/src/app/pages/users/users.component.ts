import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Category, TeachingLoad, User } from '../../models/models';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';
import { IconComponent } from '../../components/icon/icon.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { SearchBoxComponent } from '../../components/search-box/search-box.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';

const OVERLOAD_THRESHOLD_HOURS = 200;

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, SpinnerComponent, SearchBoxComponent, PaginationComponent],
  template: `
    <div class="page-header"><h2>Users</h2></div>

    <div class="card">
      <form (ngSubmit)="save()">
        <div><label>First name</label><input [(ngModel)]="form.firstName" name="firstName" required></div>
        <div><label>Last name</label><input [(ngModel)]="form.lastName" name="lastName" required></div>
        <div><label>Email</label><input type="email" [(ngModel)]="form.email" name="email" required></div>
        <div><label>Password</label><input type="password" [(ngModel)]="form.password" name="password" required></div>
        <div>
          <label>Category</label>
          <select [(ngModel)]="form.categoryId" name="categoryId" required>
            <option [ngValue]="0" disabled>-- select category --</option>
            <option *ngFor="let c of categories" [ngValue]="c.id">{{ c.name }}</option>
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
        <app-search-box placeholder="Search users..." [value]="search" (valueChange)="onSearch($event)"></app-search-box>
      </div>

      <div class="spinner-wrap" *ngIf="loading"><app-spinner></app-spinner></div>

      <ng-container *ngIf="!loading">
        <table *ngIf="filtered.length; else empty">
          <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Category</th><th></th></tr></thead>
          <tbody>
            <tr *ngFor="let u of paged">
              <td>{{ u.id }}</td>
              <td>{{ u.firstName }} {{ u.lastName }}</td>
              <td>{{ u.email }}</td>
              <td>{{ u.category?.name }}</td>
              <td>
                <button class="btn btn-secondary" *ngIf="u.category?.name === 'LECTURER'" (click)="showLoad(u)">
                  <app-icon name="workload" [size]="13"></app-icon> Workload
                </button>
                <button class="btn btn-secondary" (click)="edit(u)"><app-icon name="edit" [size]="13"></app-icon> Edit</button>
                <button class="btn btn-danger" (click)="remove(u)"><app-icon name="trash" [size]="13"></app-icon> Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
        <ng-template #empty><p class="empty-state">No users match your search.</p></ng-template>
        <app-pagination [page]="page" [pageSize]="pageSize" [length]="filtered.length" (pageChange)="page = $event"></app-pagination>
      </ng-container>
    </div>

    <div class="card" *ngIf="load">
      <h3>Teaching load — {{ load.firstName }} {{ load.lastName }}</h3>
      <p>
        {{ load.sectionsCount }} section(s), {{ load.totalHours }} hour(s) total
        <span class="badge badge-danger" *ngIf="load.totalHours > overloadThreshold">
          <app-icon name="warning" [size]="12"></app-icon> Over {{ overloadThreshold }}h threshold
        </span>
      </p>
    </div>
  `
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  categories: Category[] = [];
  load: TeachingLoad | null = null;
  form = { firstName: '', lastName: '', email: '', password: '', categoryId: 0 };
  editingId: number | null = null;
  error = '';
  loading = true;
  search = '';
  page = 1;
  pageSize = 10;
  overloadThreshold = OVERLOAD_THRESHOLD_HOURS;

  constructor(private api: ApiService, private toast: ToastService, private confirm: ConfirmService) {}

  ngOnInit() {
    this.loadUsers();
    this.api.getCategories().subscribe(data => this.categories = data);
  }

  loadUsers() {
    this.loading = true;
    this.api.getUsers().subscribe({
      next: data => { this.users = data; this.loading = false; },
      error: () => { this.loading = false; this.toast.error('Failed to load users'); }
    });
  }

  get filtered(): User[] {
    const term = this.search.trim().toLowerCase();
    if (!term) return this.users;
    return this.users.filter(u =>
      u.firstName.toLowerCase().includes(term) ||
      u.lastName.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (u.category?.name.toLowerCase().includes(term) ?? false)
    );
  }

  get paged(): User[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  onSearch(v: string) { this.search = v; this.page = 1; }

  save() {
    this.error = '';
    const wasEdit = !!this.editingId;
    const req = this.editingId
      ? this.api.updateUser(this.editingId, this.form)
      : this.api.createUser(this.form);
    req.subscribe({
      next: () => { this.cancel(); this.loadUsers(); this.toast.success(wasEdit ? 'User updated' : 'User created'); },
      error: err => { this.error = err.error?.message ?? 'Error'; this.toast.error(this.error); }
    });
  }

  edit(u: User) {
    this.editingId = u.id;
    this.form = { firstName: u.firstName, lastName: u.lastName, email: u.email, password: '', categoryId: u.category?.id ?? 0 };
  }

  cancel() {
    this.editingId = null;
    this.form = { firstName: '', lastName: '', email: '', password: '', categoryId: 0 };
  }

  async remove(u: User) {
    const ok = await this.confirm.ask(`Delete user "${u.firstName} ${u.lastName}"?`, { danger: true, confirmLabel: 'Delete' });
    if (!ok) return;
    this.api.deleteUser(u.id).subscribe({
      next: () => { this.loadUsers(); this.toast.success('User deleted'); },
      error: err => this.toast.error(err.error?.message ?? 'Error deleting user')
    });
  }

  showLoad(u: User) {
    this.api.getTeachingLoad(u.id).subscribe(data => this.load = data);
  }
}
