import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Category, TeachingLoad, User } from '../../models/models';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
          <button class="btn btn-primary" type="submit">{{ editingId ? 'Update' : 'Create' }}</button>
          <button class="btn btn-secondary" type="button" *ngIf="editingId" (click)="cancel()">Cancel</button>
        </div>
        <p class="error" *ngIf="error">{{ error }}</p>
      </form>
    </div>

    <div class="card">
      <table>
        <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Category</th><th></th></tr></thead>
        <tbody>
          <tr *ngFor="let u of users">
            <td>{{ u.id }}</td>
            <td>{{ u.firstName }} {{ u.lastName }}</td>
            <td>{{ u.email }}</td>
            <td>{{ u.category?.name }}</td>
            <td>
              <button class="btn btn-secondary" *ngIf="u.category?.name === 'LECTURER'" (click)="showLoad(u)">Workload</button>
              <button class="btn btn-secondary" (click)="edit(u)">Edit</button>
              <button class="btn btn-danger" (click)="remove(u.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card" *ngIf="load">
      <h3>Teaching load — {{ load.firstName }} {{ load.lastName }}</h3>
      <p>{{ load.sectionsCount }} section(s), {{ load.totalHours }} hour(s) total</p>
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

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadUsers();
    this.api.getCategories().subscribe(data => this.categories = data);
  }

  loadUsers() { this.api.getUsers().subscribe(data => this.users = data); }

  save() {
    this.error = '';
    const req = this.editingId
      ? this.api.updateUser(this.editingId, this.form)
      : this.api.createUser(this.form);
    req.subscribe({
      next: () => { this.cancel(); this.loadUsers(); },
      error: err => this.error = err.error?.message ?? 'Error'
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

  remove(id: number) {
    if (!confirm('Delete this user?')) return;
    this.api.deleteUser(id).subscribe({ next: () => this.loadUsers(), error: err => this.error = err.error?.message ?? 'Error' });
  }

  showLoad(u: User) {
    this.api.getTeachingLoad(u.id).subscribe(data => this.load = data);
  }
}
