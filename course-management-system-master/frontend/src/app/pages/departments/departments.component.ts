import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Department, Faculty } from '../../models/models';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
          <button class="btn btn-primary" type="submit">{{ editingId ? 'Update' : 'Create' }}</button>
          <button class="btn btn-secondary" type="button" *ngIf="editingId" (click)="cancel()">Cancel</button>
        </div>
        <p class="error" *ngIf="error">{{ error }}</p>
      </form>
    </div>

    <div class="card">
      <table>
        <thead><tr><th>ID</th><th>Name</th><th>Faculty</th><th></th></tr></thead>
        <tbody>
          <tr *ngFor="let d of departments">
            <td>{{ d.id }}</td>
            <td>{{ d.name }}</td>
            <td>{{ d.faculty?.name }}</td>
            <td>
              <button class="btn btn-secondary" (click)="edit(d)">Edit</button>
              <button class="btn btn-danger" (click)="remove(d.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class DepartmentsComponent implements OnInit {
  departments: Department[] = [];
  faculties: Faculty[] = [];
  form = { name: '', facultyId: 0 };
  editingId: number | null = null;
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.load();
    this.api.getFaculties().subscribe(data => this.faculties = data);
  }

  load() { this.api.getDepartments().subscribe(data => this.departments = data); }

  save() {
    this.error = '';
    const req = this.editingId
      ? this.api.updateDepartment(this.editingId, this.form)
      : this.api.createDepartment(this.form);
    req.subscribe({
      next: () => { this.cancel(); this.load(); },
      error: err => this.error = err.error?.message ?? 'Error'
    });
  }

  edit(d: Department) { this.editingId = d.id; this.form = { name: d.name, facultyId: d.faculty?.id ?? 0 }; }
  cancel() { this.editingId = null; this.form = { name: '', facultyId: 0 }; }

  remove(id: number) {
    if (!confirm('Delete this department?')) return;
    this.api.deleteDepartment(id).subscribe({ next: () => this.load(), error: err => this.error = err.error?.message ?? 'Error' });
  }
}
