import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private active = signal(0);
  readonly isLoading = signal(false);

  start() {
    this.active.update(n => n + 1);
    this.isLoading.set(true);
  }

  stop() {
    this.active.update(n => Math.max(0, n - 1));
    this.isLoading.set(this.active() > 0);
  }
}
