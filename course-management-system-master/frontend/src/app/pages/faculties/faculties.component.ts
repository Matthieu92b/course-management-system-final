import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Faculty } from '../../models/models';

@Component({
  selector: 'app-faculties',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
          <button class="btn btn-primary" type="submit">{{ editingId ? 'Update' : 'Create' }}</button>
          <button class="btn btn-secondary" type="button" *ngIf="editingId" (click)="cancel()">Cancel</button>
        </div>
        <p class="error" *ngIf="error">{{ error }}</p>
      </form>
    </div>

    <div class="card">
      <table>
        <thead><tr><th>ID</th><th>Name</th><th></th></tr></thead>
        <tbody>
          <tr *ngFor="let f of faculties">
            <td>{{ f.id }}</td>
            <td>{{ f.name }}</td>
            <td>
              <button class="btn btn-secondary" (click)="edit(f)">Edit</button>
              <button class="btn btn-danger" (click)="remove(f.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class FacultiesComponent implements OnInit {
  faculties: Faculty[] = [];
  name = '';
  editingId: number | null = null;
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit() { this.load(); }

  load() { this.api.getFaculties().subscribe(data => this.faculties = data); }

  save() {
    this.error = '';
    const req = this.editingId
      ? this.api.updateFaculty(this.editingId, { name: this.name })
      : this.api.createFaculty({ name: this.name });
    req.subscribe({
      next: () => { this.cancel(); this.load(); },
      error: err => this.error = err.error?.message ?? 'Error'
    });
  }

  edit(f: Faculty) { this.editingId = f.id; this.name = f.name; }
  cancel() { this.editingId = null; this.name = ''; }

  remove(id: number) {
    if (!confirm('Delete this faculty?')) return;
    this.api.deleteFaculty(id).subscribe({
      next: () => this.load(),
      error: err => this.error = err.error?.message ?? 'Error'
    });
  }
}
