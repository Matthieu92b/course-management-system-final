import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="toast-stack">
      <div class="toast" *ngFor="let t of toast.toasts()" [class]="'toast-' + t.type">
        <app-icon [name]="t.type === 'success' ? 'check' : t.type === 'error' ? 'error' : 'info'" [size]="18"></app-icon>
        <span class="toast-message">{{ t.message }}</span>
        <button class="toast-close" type="button" (click)="toast.dismiss(t.id)" aria-label="Dismiss">
          <app-icon name="close" [size]="14"></app-icon>
        </button>
      </div>
    </div>
  `
})
export class ToastContainerComponent {
  constructor(public toast: ToastService) {}
}
