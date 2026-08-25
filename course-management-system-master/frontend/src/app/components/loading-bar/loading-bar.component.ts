import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-loading-bar',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="loading-bar" *ngIf="loading.isLoading()"><div class="loading-bar-fill"></div></div>`
})
export class LoadingBarComponent {
  constructor(public loading: LoadingService) {}
}
