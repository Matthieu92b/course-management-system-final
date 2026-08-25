import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  template: `<div class="spinner" [style.width.px]="size" [style.height.px]="size"></div>`
})
export class SpinnerComponent {
  @Input() size = 28;
}
