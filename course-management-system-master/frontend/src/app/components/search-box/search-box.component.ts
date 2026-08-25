import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="search-box">
      <app-icon name="search" [size]="15"></app-icon>
      <input
        type="text"
        [placeholder]="placeholder"
        [ngModel]="value"
        (ngModelChange)="onChange($event)"
      >
      <button type="button" class="search-clear" *ngIf="value" (click)="onChange('')" aria-label="Clear search">
        <app-icon name="close" [size]="13"></app-icon>
      </button>
    </div>
  `
})
export class SearchBoxComponent {
  @Input() value = '';
  @Input() placeholder = 'Search...';
  @Output() valueChange = new EventEmitter<string>();

  onChange(v: string) {
    this.value = v;
    this.valueChange.emit(v);
  }
}
