import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Appointment, Section } from '../../models/models';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';
import { IconComponent } from '../../components/icon/icon.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { SearchBoxComponent } from '../../components/search-box/search-box.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, SpinnerComponent, SearchBoxComponent, PaginationComponent],
  template: `
    <div class="page-header"><h2>Appointments</h2></div>

    <div class="card">
      <form (ngSubmit)="save()">
        <div>
          <label>Section</label>
          <select [(ngModel)]="form.sectionId" name="sectionId" required>
            <option [ngValue]="0" disabled>-- select section --</option>
            <option *ngFor="let s of sections" [ngValue]="s.id">
              {{ s.activeCourse?.course?.code }} / {{ s.type }} / {{ s.dayOfWeek || '—' }} {{ s.startTime }}-{{ s.endTime }}
            </option>
          </select>
        </div>
        <div><label>Date</label><input type="date" [(ngModel)]="form.date" name="date" required></div>
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
        <app-search-box placeholder="Search appointments..." [value]="search" (valueChange)="onSearch($event)"></app-search-box>
      </div>

      <div class="spinner-wrap" *ngIf="loading"><app-spinner></app-spinner></div>

      <ng-container *ngIf="!loading">
        <table *ngIf="filtered.length; else empty">
          <thead><tr><th>ID</th><th>Course</th><th>Type</th><th>Date</th><th>Schedule</th><th>Lecturer</th><th></th></tr></thead>
          <tbody>
            <tr *ngFor="let a of paged">
              <td>{{ a.id }}</td>
              <td>{{ a.section?.activeCourse?.course?.code }}</td>
              <td>{{ a.section?.type }}</td>
              <td>{{ a.date }}</td>
              <td>{{ a.section?.dayOfWeek }} {{ a.section?.startTime }}-{{ a.section?.endTime }}</td>
              <td>{{ a.section?.lecturer?.firstName }} {{ a.section?.lecturer?.lastName }}</td>
              <td>
                <button class="btn btn-secondary" (click)="edit(a)"><app-icon name="edit" [size]="13"></app-icon> Edit</button>
                <button class="btn btn-danger" (click)="remove(a)"><app-icon name="trash" [size]="13"></app-icon> Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
        <ng-template #empty><p class="empty-state">No appointments match your search.</p></ng-template>
        <app-pagination [page]="page" [pageSize]="pageSize" [length]="filtered.length" (pageChange)="page = $event"></app-pagination>
      </ng-container>
    </div>
  `
})
export class AppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  sections: Section[] = [];
  form = { sectionId: 0, date: '' };
  editingId: number | null = null;
  error = '';
  loading = true;
  search = '';
  page = 1;
  pageSize = 10;

  constructor(private api: ApiService, private toast: ToastService, private confirm: ConfirmService) {}

  ngOnInit() {
    this.load();
    this.api.getSections().subscribe(data => this.sections = data);
  }

  load() {
    this.loading = true;
    this.api.getAppointments().subscribe({
      next: data => { this.appointments = data; this.loading = false; },
      error: () => { this.loading = false; this.toast.error('Failed to load appointments'); }
    });
  }

  get filtered(): Appointment[] {
    const term = this.search.trim().toLowerCase();
    if (!term) return this.appointments;
    return this.appointments.filter(a =>
      (a.section?.activeCourse?.course?.code.toLowerCase().includes(term) ?? false) ||
      a.date.includes(term) ||
      (a.section?.lecturer?.lastName.toLowerCase().includes(term) ?? false)
    );
  }

  get paged(): Appointment[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  onSearch(v: string) { this.search = v; this.page = 1; }

  save() {
    this.error = '';
    const wasEdit = !!this.editingId;
    const req = this.editingId
      ? this.api.updateAppointment(this.editingId, this.form)
      : this.api.createAppointment(this.form);
    req.subscribe({
      next: () => { this.cancel(); this.load(); this.toast.success(wasEdit ? 'Appointment updated' : 'Appointment created'); },
      error: err => { this.error = err.error?.message ?? 'Error'; this.toast.error(this.error); }
    });
  }

  edit(a: Appointment) { this.editingId = a.id; this.form = { sectionId: a.section?.id ?? 0, date: a.date }; }
  cancel() { this.editingId = null; this.form = { sectionId: 0, date: '' }; }

  async remove(a: Appointment) {
    const ok = await this.confirm.ask(`Delete this appointment on ${a.date}? Attendance records for it will also be lost.`, { danger: true, confirmLabel: 'Delete' });
    if (!ok) return;
    this.api.deleteAppointment(a.id).subscribe({
      next: () => { this.load(); this.toast.success('Appointment deleted'); },
      error: err => this.toast.error(err.error?.message ?? 'Error deleting appointment')
    });
  }
}
