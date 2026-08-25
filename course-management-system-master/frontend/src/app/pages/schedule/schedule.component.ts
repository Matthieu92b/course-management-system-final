import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { LecturerScheduleComponent } from '../lecturer-schedule/lecturer-schedule.component';
import { StudentScheduleComponent } from '../student-schedule/student-schedule.component';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, LecturerScheduleComponent, StudentScheduleComponent],
  template: `
    <app-lecturer-schedule *ngIf="auth.isLecturer()"></app-lecturer-schedule>
    <app-student-schedule *ngIf="auth.isStudent()"></app-student-schedule>
  `
})
export class ScheduleComponent {
  constructor(public auth: AuthService) {}
}
