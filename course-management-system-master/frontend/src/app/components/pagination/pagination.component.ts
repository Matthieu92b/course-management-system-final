import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="pagination" *ngIf="totalPages > 1">
      <span class="pagination-info">
        {{ (page - 1) * pageSize + 1 }}–{{ lastItemIndex }} of {{ length }}
      </span>
      <div class="pagination-controls">
        <button class="btn btn-secondary" type="button" [disabled]="page === 1" (click)="go(page - 1)">
          <app-icon name="chevronLeft" [size]="14"></app-icon>
        </button>
        <span class="pagination-page">Page {{ page }} / {{ totalPages }}</span>
        <button class="btn btn-secondary" type="button" [disabled]="page === totalPages" (click)="go(page + 1)">
          <app-icon name="chevronRight" [size]="14"></app-icon>
        </button>
      </div>
    </div>
  `
})
export class PaginationComponent {
  @Input() page = 1;
  @Input() pageSize = 10;
  @Input() length = 0;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.length / this.pageSize));
  }

  get lastItemIndex(): number {
    return Math.min(this.length, this.page * this.pageSize);
  }

  go(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.pageChange.emit(page);
  }
}
