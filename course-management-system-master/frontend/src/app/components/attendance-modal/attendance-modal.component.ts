import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AppointmentDetail, AttendanceRecord, AttendanceStatus } from '../../models/models';
import { ToastService } from '../../services/toast.service';
import { IconComponent } from '../icon/icon.component';
import { SpinnerComponent } from '../spinner/spinner.component';

const STATUSES: AttendanceStatus[] = ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'];

@Component({
  selector: 'app-attendance-modal',
  standalone: true,
  imports: [CommonModule, IconComponent, SpinnerComponent],
  template: `
    <div class="confirm-backdrop" (click)="close.emit()">
      <div class="attendance-box" (click)="$event.stopPropagation()">
        <div class="spinner-wrap" *ngIf="loading"><app-spinner></app-spinner></div>

        <ng-container *ngIf="!loading && detail as d">
          <div class="attendance-header">
            <div>
              <h3>{{ d.courseCode }} — {{ d.courseTitle }}</h3>
              <p class="attendance-meta">
                {{ d.dayOfWeek }} {{ d.date }} · {{ d.startTime }}–{{ d.endTime }} · {{ d.sectionType }}
                <span *ngIf="d.room"> · Room {{ d.room }}</span>
              </p>
              <p class="attendance-meta" *ngIf="d.cohorts.length">
                <app-icon name="cohort" [size]="13"></app-icon>
                {{ cohortNames() }}
              </p>
            </div>
            <button class="toast-close" type="button" (click)="close.emit()" aria-label="Close">
              <app-icon name="close" [size]="16"></app-icon>
            </button>
          </div>

          <table *ngIf="records.length; else noStudents">
            <thead><tr><th>Student</th><th>Attendance</th></tr></thead>
            <tbody>
              <tr *ngFor="let r of records">
                <td>{{ r.studentName }}</td>
                <td>
                  <div class="attendance-status-group">
                    <button
                      type="button"
                      *ngFor="let s of statuses"
                      class="attendance-status-btn"
                      [class]="'status-' + s.toLowerCase()"
                      [class.selected]="r.status === s"
                      (click)="r.status = s"
                    >{{ s }}</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <ng-template #noStudents><p class="empty-state">No students are enrolled in this session's cohort(s) yet.</p></ng-template>

          <div class="attendance-actions">
            <button class="btn btn-secondary" type="button" (click)="close.emit()">Cancel</button>
            <button class="btn btn-primary" type="button" [disabled]="saving || !records.length" (click)="save()">
              {{ saving ? 'Saving…' : 'Save attendance' }}
            </button>
          </div>
        </ng-container>
      </div>
    </div>
  `
})
export class AttendanceModalComponent implements OnChanges {
  @Input({ required: true }) appointmentId!: number;
  @Output() close = new EventEmitter<void>();

  statuses = STATUSES;
  detail: AppointmentDetail | null = null;
  records: AttendanceRecord[] = [];
  loading = true;
  saving = false;

  constructor(private api: ApiService, private toast: ToastService) {}

  cohortNames(): string {
    return (this.detail?.cohorts ?? []).map(c => c.name).join(', ');
  }

  ngOnChanges() {
    this.loading = true;
    this.api.getAppointmentDetail(this.appointmentId).subscribe({
      next: detail => {
        this.detail = detail;
        this.api.getAttendance(this.appointmentId).subscribe({
          next: records => { this.records = records; this.loading = false; },
          error: () => { this.loading = false; this.toast.error('Failed to load attendance'); }
        });
      },
      error: () => { this.loading = false; this.toast.error('Failed to load session details'); }
    });
  }

  save() {
    const entries = this.records
      .filter(r => r.status != null)
      .map(r => ({ studentId: r.studentId, status: r.status! }));

    if (!entries.length) {
      this.toast.error('Select an attendance status for at least one student');
      return;
    }

    this.saving = true;
    this.api.saveAttendance(this.appointmentId, entries).subscribe({
      next: () => { this.saving = false; this.toast.success('Attendance saved'); this.close.emit(); },
      error: err => { this.saving = false; this.toast.error(err.error?.message ?? 'Failed to save attendance'); }
    });
  }
}
