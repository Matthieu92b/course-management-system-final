import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ScheduleEntry } from '../../models/models';
import { ToastService } from '../../services/toast.service';
import { SpinnerComponent } from '../../components/spinner/spinner.component';

const DAY_ORDER = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

@Component({
  selector: 'app-student-schedule',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  template: `
    <div class="page-header"><h2>My Weekly Schedule</h2></div>

    <div class="spinner-wrap" *ngIf="loading"><app-spinner></app-spinner></div>

    <ng-container *ngIf="!loading">
      <p class="empty-state" *ngIf="!hasCohort">
        You are not assigned to a cohort yet. Contact an administrator to get your schedule set up.
      </p>
      <p class="empty-state" *ngIf="hasCohort && !entries.length">No sessions scheduled for your cohort yet.</p>

      <div class="week-grid" *ngIf="entries.length">
        <div class="week-day-col" *ngFor="let day of days">
          <div class="week-day-header">{{ day }}</div>
          <div class="schedule-entry" *ngFor="let e of byDay[day]">
            <div class="time">{{ e.startTime }}–{{ e.endTime }}</div>
            <div class="course">{{ e.courseCode }} · {{ e.sectionType }}</div>
            <div class="meta">{{ e.date }}</div>
            <div class="meta" *ngIf="e.room">Room {{ e.room }}</div>
            <div class="meta" *ngIf="e.lecturerName">{{ e.lecturerName }}</div>
          </div>
        </div>
      </div>
    </ng-container>
  `
})
export class StudentScheduleComponent implements OnInit {
  entries: ScheduleEntry[] = [];
  days = DAY_ORDER;
  byDay: Record<string, ScheduleEntry[]> = {};
  loading = true;
  hasCohort = true;

  constructor(private api: ApiService, private auth: AuthService, private toast: ToastService) {}

  ngOnInit() {
    const user = this.auth.currentUser();
    if (!user) return;

    this.hasCohort = user.cohortId != null;
    if (!this.hasCohort) {
      this.loading = false;
      return;
    }

    this.api.getStudentSchedule(user.id).subscribe({
      next: data => {
        this.entries = data;
        this.byDay = this.groupByDay(data);
        this.loading = false;
      },
      error: () => { this.loading = false; this.toast.error('Failed to load your schedule'); }
    });
  }

  private groupByDay(entries: ScheduleEntry[]): Record<string, ScheduleEntry[]> {
    const grouped: Record<string, ScheduleEntry[]> = {};
    for (const day of DAY_ORDER) grouped[day] = [];
    for (const entry of entries) {
      (grouped[entry.dayOfWeek] ??= []).push(entry);
    }
    for (const day of DAY_ORDER) grouped[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
    return grouped;
  }
}
