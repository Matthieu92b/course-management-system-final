import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmService } from '../../services/confirm.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="confirm-backdrop" *ngIf="confirm.request() as req" (click)="confirm.resolve(false)">
      <div class="confirm-box" (click)="$event.stopPropagation()">
        <div class="confirm-icon" [class.danger]="req.danger">
          <app-icon [name]="req.danger ? 'warning' : 'info'" [size]="22"></app-icon>
        </div>
        <h3>{{ req.title }}</h3>
        <p>{{ req.message }}</p>
        <div class="confirm-actions">
          <button class="btn btn-secondary" type="button" (click)="confirm.resolve(false)">{{ req.cancelLabel }}</button>
          <button class="btn" [class.btn-danger]="req.danger" [class.btn-primary]="!req.danger" type="button" (click)="confirm.resolve(true)">{{ req.confirmLabel }}</button>
        </div>
      </div>
    </div>
  `
})
export class ConfirmDialogComponent {
  constructor(public confirm: ConfirmService) {}
}
