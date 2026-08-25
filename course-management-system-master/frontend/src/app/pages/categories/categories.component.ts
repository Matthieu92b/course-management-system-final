import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Category } from '../../models/models';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header"><h2>Categories</h2></div>

    <div class="card">
      <form (ngSubmit)="save()">
        <div>
          <label>Name</label>
          <input [(ngModel)]="name" name="name" required placeholder="SECRETARY">
        </div>
        <div><button class="btn btn-primary" type="submit">Create</button></div>
        <p class="error" *ngIf="error">{{ error }}</p>
      </form>
    </div>

    <div class="card">
      <table>
        <thead><tr><th>ID</th><th>Name</th><th></th></tr></thead>
        <tbody>
          <tr *ngFor="let c of categories">
            <td>{{ c.id }}</td>
            <td>{{ c.name }}</td>
            <td><button class="btn btn-danger" (click)="remove(c.id)">Delete</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  name = '';
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit() { this.load(); }
  load() { this.api.getCategories().subscribe(data => this.categories = data); }

  save() {
    this.error = '';
    this.api.createCategory({ name: this.name }).subscribe({
      next: () => { this.name = ''; this.load(); },
      error: err => this.error = err.error?.message ?? 'Error'
    });
  }

  remove(id: number) {
    if (!confirm('Delete this category? Users referencing it will block the delete.')) return;
    this.api.deleteCategory(id).subscribe({
      next: () => this.load(),
      error: err => this.error = err.error?.message ?? 'Cannot delete: category in use'
    });
  }
}
